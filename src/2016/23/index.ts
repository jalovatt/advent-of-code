import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

type Register = 'a' | 'b' | 'c' | 'd';
type Operation = 'cpy' | 'inc' | 'dec' | 'jnz' | 'tgl';
type Argument = number | Register;
type Command = [
  Operation,
  Argument,
  Argument | undefined,
];

// [if]: [becomes]
const OpSwaps: Record<Operation, Operation> = {
  inc: 'dec',
  dec: 'inc',
  tgl: 'inc',
  jnz: 'cpy',
  cpy: 'jnz',
};

export const solve = (input: string, initA = 0): number => {
  const mem: Record<Register | 'cursor', number> = { a: initA, b: 0, c: 0, d: 0, cursor: 0 };

  const instructions: Command[] = split(input).map((line) => {
    const [op, xRaw, yRaw] = line.split(' ');

    const xParsed = parseInt(xRaw, 10);
    const yParsed = parseInt(yRaw, 10);

    const x = Number.isNaN(xParsed) ? xRaw as Register : xParsed;
    const y = Number.isNaN(yParsed) ? yRaw as Register : yParsed;

    return [op as Operation, x, y];
  });

  const resolve = (v: Register | number): number => (typeof v === 'number' ? v : mem[v]);

  const ops: Record<Operation, (x: Argument, y?: Argument) => void> = {
    cpy: (x, y) => {
      if (typeof y !== 'number') {
        mem[y as Register] = resolve(x);
      }
    },
    inc: (x) => {
      if (typeof x !== 'number') {
        mem[x as Register] += 1;
      }
    },
    dec: (x) => {
      if (typeof x !== 'number') {
        mem[x as Register] -= 1;
      }
    },
    jnz: (x, y) => {
      if (mem[x! as Register] !== 0) {
        mem.cursor += resolve(y!) - 1;
      }
    },
    tgl: (x) => {
      const index = mem.cursor + resolve(x);
      if (index < instructions.length) {
        const next = OpSwaps[instructions[index][0]];
        instructions[index][0] = next;
      }
    },
  };

  const breaker = new CircuitBreaker(10000000000);
  while (mem.cursor < instructions.length) {
    breaker.tick();

    const cmd = instructions[mem.cursor];
    ops[cmd[0]](cmd[1], cmd[2]);

    mem.cursor += 1;
  }

  return mem.a;
};
