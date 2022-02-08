import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

enum Operation { set, sub, mul, jnz }
type Argument = string | number;
type Instruction = { op: Operation, a: Argument, b: Argument };

class VM {
  mem: Record<string, number>;
  instructions: Instruction[];
  cursor: number;
  timesMultiplied: number;

  constructor(instructions: Instruction[]) {
    this.mem = {};
    this.instructions = instructions;
    this.cursor = 0;
    this.timesMultiplied = 0;
  }

  resolve(v: Argument): number {
    if (typeof v === 'number') { return v; }
    if (this.mem[v] === undefined) { this.mem[v] = 0; }
    return this.mem[v];
  }

  operations: Record<Operation, (a: Argument, b: Argument) => void> = {
    [Operation.set]: (a, b) => {
      this.mem[a as string] = this.resolve(b);
    },
    [Operation.sub]: (a, b) => {
      this.mem[a as string] = this.resolve(a) - this.resolve(b);
    },
    [Operation.mul]: (a, b) => {
      this.timesMultiplied += 1;
      this.mem[a as string] = this.resolve(a) * this.resolve(b);
    },
    [Operation.jnz]: (a, b) => {
      if (this.resolve(a) !== 0) {
        this.cursor += this.resolve(b) - 1;
      }
    },
  };

  step() {
    const cur = this.instructions[this.cursor];

    this.operations[cur.op](cur.a, cur.b);
    this.cursor += 1;
  }

  run() {
    const breaker = new CircuitBreaker(10000000000);
    while (this.cursor >= 0 && this.cursor < this.instructions.length) {
      breaker.tick();
      this.step();
    }
  }
}

const parseInput = (input: string): Instruction[] => split(input).map((line) => {
  const [op, aRaw, bRaw] = line.split(' ');

  const a = parseInt(aRaw, 10);
  const b = parseInt(bRaw, 10);

  return {
    op: Operation[op as keyof typeof Operation],
    a: !Number.isNaN(a) ? a : aRaw,
    b: !Number.isNaN(b) ? b : bRaw,
  };
});

export const part1 = (input: string): number => {
  const instructions = parseInput(input);
  const vm = new VM(instructions);

  vm.run();

  return vm.timesMultiplied;
};

/**
 * After fiddling with the input for a while, this turns out to be an extremely
 * naive implementation of "count the number of composite numbers from b through c".
 *
 * Limiting the two loops to d < sqrt(b) and e <= b / 2, and breaking early once
 * we know it's a composite, brings it down to a relatively zippy ~7 seconds.
 *
 * Obviously the problem itself can be done much faster in other ways.
 */
export const part2 = (): number => {
  const mem = { b: 108400, c: 125400, f: 0, d: 0, e: 0, h: 0 };

  while (true) {
    mem.f = 1;
    mem.d = 2;

    const dLimit = Math.sqrt(mem.b);
    const eLimit = mem.b / 2;
    dLoop:
    do {
      mem.e = 2;

      do {
        if (mem.b === mem.e * mem.d) {
          mem.f = 0;
          break dLoop;
        }

        mem.e += 1;
      } while (mem.e <= eLimit);
      mem.d += 1;
    } while (mem.d < dLimit);

    if (mem.f === 0) { mem.h += 1; }
    if (mem.b === mem.c) { break; }

    mem.b += 17;
  }

  return mem.h;
};
