import { splitToNumber } from '@lib/processing';

enum OpCode {
  Add = 1,
  Mult = 2,
  End = 99,
}

export class IntCode {
  state: number[];
  cursor: number;

  constructor(input: string, replaceInitialState?: [number, number][]) {
    this.state = splitToNumber(input, ',');
    this.cursor = 0;

    if (replaceInitialState) {
      replaceInitialState.forEach(([i, v]) => {
        this.state[i] = v;
      });
    }
  }

  codes: { [key in OpCode]: () => number | null } = {
    [OpCode.Add]: () => {
      const ia = this.state[this.cursor + 1];
      const ib = this.state[this.cursor + 2];
      const iout = this.state[this.cursor + 3];

      this.state[iout] = this.state[ia] + this.state[ib];
      return this.cursor + 4;
    },
    [OpCode.Mult]: () => {
      const ia = this.state[this.cursor + 1];
      const ib = this.state[this.cursor + 2];
      const iout = this.state[this.cursor + 3];

      this.state[iout] = this.state[ia] * this.state[ib];
      return this.cursor + 4;
    },
    [OpCode.End]: () => null,
  };

  step() {
    const code = this.state[this.cursor] as OpCode;
    const next = this.codes[code]();

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
}
