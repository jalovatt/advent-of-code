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
  End = 99,
}

type ConstructorArgs = {
  replaceInitialState?: [number, number][],
  input?: number[],
};

enum ParamMode {
  Position = 0,
  Immediate = 1,
}

type ParamModes = [ParamMode, ParamMode, ParamMode];

export class IntCode {
  state: number[];
  cursor: number;
  input: number[];
  output: number[];
  debug: boolean;

  constructor(inputStr: string, { replaceInitialState, input = [] }: ConstructorArgs = {}) {
    this.state = splitToNumber(inputStr, ',');
    this.cursor = 0;
    this.debug = false;

    this.input = input;
    this.output = [];

    if (replaceInitialState) {
      replaceInitialState.forEach(([i, v]) => {
        this.state[i] = v;
      });
    }
  }

  read(offset: number, mode: ParamMode = 0) {
    const index = this.state[this.cursor + offset];

    if (mode === 1) {
      return index;
    }

    return this.state[index];
  }

  codes: { [key in OpCode]: (modes: ParamModes) => number | null } = {
    [OpCode.Add]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);
      /*
        Write parameters are always read as Immediate; the value at [cursor + 3]
        is the index we write to.

        This is backwards from how the puzzle specifies it, which I find
        misleading. If [cursor + 3] has 4, we write to 4 rather than checking
        [4] for our destination index.
      */
      const dest = this.read(3, 1);

      this.state[dest] = a + b;
      return this.cursor + 4;
    },
    [OpCode.Mult]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);
      const dest = this.read(3, 1);

      this.state[dest] = a * b;

      return this.cursor + 4;
    },
    [OpCode.In]: () => {
      const dest = this.read(1, 1);

      if (!this.input.length) {
        throw new Error('Unexpected end of input');
      }

      this.state[dest] = this.input.shift()!;

      if (this.debug) {
        // eslint-disable-next-line no-console
        console.log('Read value', this.state[dest], 'from input to', dest);
      }

      return this.cursor + 2;
    },
    [OpCode.Out]: (modes) => {
      const src = this.read(1, modes[0]);
      this.output.push(src);

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
      const c = this.read(3, 1);

      this.state[c] = (a < b)
        ? 1
        : 0;

      return this.cursor + 4;
    },
    [OpCode.Equals]: (modes) => {
      const a = this.read(1, modes[0]);
      const b = this.read(2, modes[1]);
      const c = this.read(3, 1);

      this.state[c] = (a === b)
        ? 1
        : 0;

      return this.cursor + 4;
    },
    [OpCode.End]: () => null,
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

    if (this.debug) {
      // eslint-disable-next-line no-console
      console.dir({
        state: this.stringifyState(),
        instruction,
        modes,
        code: `${code} - ${OpCode[code]}`,
      });
    }

    const next = this.codes[code](modes as ParamModes);

    if (next !== null) {
      this.cursor = next;
    }

    return next;
  }

  run() {
    let result;

    do {
      result = this.step();
    } while (result !== null);

    return this.state;
  }

  stringifyState(): string {
    const out: (string | number)[] = [...this.state];
    out[this.cursor] = `[${out[this.cursor]}]`;

    return out.join(',');
  }
}
