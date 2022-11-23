import { dir } from '@lib/logging';
import { splitToNumber } from '@lib/processing';

enum OpCode {
  Add = 1,
  Mult = 2,
  In = 3,
  Out = 4,
  JumpIf = 5,
  JumpNot = 6,
  Less = 7,
  Equals = 8,
  AdjustRelative = 9,
  End = 99,
}

type ConstructorArgs = {
  replaceInitialState?: [number, number][],
  input?: number[],
};

enum ParamMode {
  Position = 0,
  Immediate = 1,
  Relative = 2,
}

type ParamModes = [ParamMode, ParamMode, ParamMode];

export enum RunState {
  Running,
  Waiting,
  Halted,
}

export class IntCode {
  state: number[];
  cursor: number;
  input: number[];
  output: number[];
  relativeBase: number;
  runState: RunState;
  debug: boolean;

  constructor(inputStr: string, { replaceInitialState, input = [] }: ConstructorArgs = {}) {
    this.state = splitToNumber(inputStr, ',');

    this.cursor = 0;
    this.runState = RunState.Waiting;
    this.relativeBase = 0;
    this.debug = false;

    this.input = input;
    this.output = [];

    if (replaceInitialState) {
      replaceInitialState.forEach(([i, v]) => {
        this.state[i] = v;
      });
    }
  }

  write(offset: number, mode: ParamMode, value: number) {
    const index = this.state[this.cursor + offset] ?? 0;

    if (mode === ParamMode.Immediate) {
      throw new Error('Cannot write in Immediate mode');
    } else if (mode === ParamMode.Relative) {
      this.state[this.relativeBase + index] = value;
    } else {
      this.state[index] = value;
    }
  }

  read(offset: number, mode: ParamMode) {
    const index = this.state[this.cursor + offset] ?? 0;

    if (mode === ParamMode.Immediate) {
      return index;
    }

    if (mode === ParamMode.Relative) {
      return this.state[this.relativeBase + index] ?? 0;
    }

    return this.state[index] ?? 0;
  }

  codes: { [key in OpCode]: (modes: ParamModes) => number } = {
    [OpCode.Add]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);

      this.write(3, modes[2], a + b);

      return this.cursor + 4;
    },
    [OpCode.Mult]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);

      this.write(3, modes[2], a * b);

      return this.cursor + 4;
    },
    [OpCode.In]: (modes) => {
      if (!this.input.length) {
        this.runState = RunState.Waiting;
        return this.cursor;
      }

      if (this.runState === RunState.Waiting) {
        this.runState = RunState.Running;
      }

      const v = this.input.shift()!;

      this.write(1, modes[0], v);

      if (this.debug) {
        // eslint-disable-next-line no-console
        console.log('Read value', v, 'from input');
      }

      return this.cursor + 2;
    },
    [OpCode.Out]: (modes) => {
      const src = this.read(1, modes[0]);
      this.output.push(src);

      if (this.debug) {
        // eslint-disable-next-line no-console
        console.log('Wrote value', src, 'to output');
      }

      return this.cursor + 2;
    },
    [OpCode.JumpIf]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);

      return a
        ? b
        : this.cursor + 3;
    },
    [OpCode.JumpNot]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);

      return a
        ? this.cursor + 3
        : b;
    },
    [OpCode.Less]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);

      this.write(3, modes[2], a < b ? 1 : 0);

      return this.cursor + 4;
    },
    [OpCode.Equals]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);

      this.write(3, modes[2], a === b ? 1 : 0);

      return this.cursor + 4;
    },
    [OpCode.AdjustRelative]: (modes) => {
      const v = this.read(1, modes[0]);
      this.relativeBase += v;

      return this.cursor + 2;
    },
    [OpCode.End]: () => {
      this.runState = RunState.Halted;
      return this.cursor;
    },
  };

  step() {
    if (this.state[this.cursor] === undefined) {
      throw new Error('Invalid cursor position');
    }
    const instruction = this.state[this.cursor];
    let modeDigits = (instruction / 100) >> 0;

    const modes: number[] = [];
    while (modeDigits) {
      modes.push(modeDigits % 10 as ParamMode);
      modeDigits = (modeDigits / 10) >> 0;
    }

    const code = instruction % 100 as OpCode;

    if (this.debug || !this.codes[code]) {
      dir({
        cursor: this.cursor,
        instruction,
        modes,
        code: `${code} - ${OpCode[code]}`,
        params: this.state.slice(this.cursor + 1, this.cursor + 4),
        relativeBase: this.relativeBase,
        input: this.input,
        output: this.output,
        state: this.stringifyState(),
      });
    }

    const next = this.codes[code](modes as ParamModes);

    if (this.runState === RunState.Running) {
      this.cursor = next;
    }
  }

  run() {
    this.runState = RunState.Running;

    do {
      this.step();
    } while (this.runState === RunState.Running);

    return this.state;
  }

  stringifyState(): string {
    const out: (string | number)[] = [...this.state];
    out[this.cursor] = `[${out[this.cursor]}]`;
    out[this.relativeBase] = `{${out[this.relativeBase]}}`;

    return out.join(',');
  }
}
