import { split } from '@lib/processing';

type Operation = 'snd' | 'set' | 'add' | 'mul' | 'mod' | 'rcv' | 'jgz';
type Argument = string | number;
type Instruction = { op: Operation, a: string, b?: Argument };

type Mem1 = Record<string, number> & { lastPlayed: number, cursor: number };

const parseInput = (input: string): Instruction[] => split(input).map((line) => {
  const [op, aRaw, bRaw] = line.split(' ');

  const a = parseInt(aRaw, 10);
  const b = parseInt(bRaw, 10);

  return {
    op,
    a: !Number.isNaN(a) ? a : aRaw,
    b: !Number.isNaN(b) ? b : bRaw,
  } as Instruction;
});

class VM1 {
  mem: Mem1;
  instructions: Instruction[];
  hasTerminated: boolean;

  constructor(input: string) {
    this.mem = { lastPlayed: 0, cursor: 0 };
    this.instructions = parseInput(input);
    this.hasTerminated = false;
  }

  resolve(v: Argument): number {
    if (typeof v === 'number') { return v; }

    if (this.mem[v] === undefined) {
      this.mem[v] = 0;
    }

    return this.mem[v];
  }

  operations: Record<Operation, (a: string, b?: Argument) => number | void> = {
    snd: (a) => { this.mem.lastPlayed = this.resolve(a); },
    set: (a, b) => { this.mem[a as string] = this.resolve(b!); },
    add: (a, b) => { this.mem[a as string] = this.resolve(a) + this.resolve(b!); },
    mul: (a, b) => { this.mem[a as string] = this.resolve(a) * this.resolve(b!); },
    mod: (a, b) => { this.mem[a as string] = this.resolve(a) % this.resolve(b!); },
    rcv: (a) => (this.resolve(a) ? this.mem.lastPlayed : undefined),
    jgz: (a, b) => {
      if (this.resolve(a) > 0) {
        this.mem.cursor += (this.resolve(b!) - 1);
      }
    },
  };

  step(): number | void {
    if (this.hasTerminated) { throw new Error('Already terminated'); }

    const cur = this.instructions[this.mem.cursor];
    const recovered = this.operations[cur.op](cur.a, cur.b);

    this.mem.cursor += 1;

    if (this.mem.cursor < 0 || this.mem.cursor >= this.instructions.length) {
      this.hasTerminated = true;
    }

    return recovered;
  }
}

export const part1 = (input: string): number => {
  const vm = new VM1(input);

  while (!vm.hasTerminated) {
    const recovered = vm.step();

    if (recovered !== undefined) {
      return recovered;
    }
  }

  throw new Error('Something went seriously wrong if we got here');
};

const WAITING = Symbol('waiting');

class VM2 {
  cursor: number;
  queue: number[];
  mem: Record<string, number>;
  instructions: Instruction[];
  hasTerminated: boolean;

  constructor(input: string, pid: number) {
    this.cursor = 0;
    this.queue = [];
    this.mem = { p: pid };
    this.instructions = parseInput(input);
    this.hasTerminated = false;
  }

  resolve(v: Argument): number {
    if (typeof v === 'number') { return v; }

    if (this.mem[v] === undefined) {
      this.mem[v] = 0;
    }

    return this.mem[v];
  }

  operations: Record<Operation, (a: string, b?: Argument) => number | typeof WAITING | void> = {
    set: (a, b) => { this.mem[a as string] = this.resolve(b!); },
    add: (a, b) => { this.mem[a as string] = this.resolve(a) + this.resolve(b!); },
    mul: (a, b) => { this.mem[a as string] = this.resolve(a) * this.resolve(b!); },
    mod: (a, b) => { this.mem[a as string] = this.resolve(a) % this.resolve(b!); },
    jgz: (a, b) => {
      if (this.resolve(a) > 0) {
        this.cursor += (this.resolve(b!) - 1);
      }
    },
    snd: (a) => this.resolve(a),
    rcv: (a) => {
      const v = this.queue.shift();

      if (v !== undefined) {
        this.mem[a] = v;
      } else {
        this.cursor -= 1;
        return WAITING;
      }

      return undefined;
    },
  };

  step(): number | typeof WAITING | void {
    if (this.hasTerminated) { throw new Error('Already terminated'); }

    const cur = this.instructions[this.cursor];
    const toSend = this.operations[cur.op](cur.a, cur.b);

    this.cursor += 1;

    if (this.cursor < 0 || this.cursor >= this.instructions.length) {
      this.hasTerminated = true;
    }

    return toSend;
  }
}

export const part2 = (input: string): number => {
  const l = new VM2(input, 0);
  const r = new VM2(input, 1);

  let timesSent = 0;

  let lResult: number | typeof WAITING | void;
  let rResult: number | typeof WAITING | void;
  while (!(l.hasTerminated && r.hasTerminated) && !(lResult === WAITING && rResult === WAITING)) {
    lResult = l.step();

    if (typeof lResult === 'number') {
      r.queue.push(lResult);
    }

    rResult = r.step();

    if (typeof rResult === 'number') {
      l.queue.push(rResult);
      timesSent += 1;
    }
  }

  return timesSent;
};
