import circuitBreaker from '@lib/circuitBreaker';
import { split } from '@lib/processing';

type Register = 'a' | 'b' | 'c' | 'd';
type Command = 'cpy' | 'inc' | 'dec' | 'jnz';

const solve = (input: string, initC = 0): number => {
  const mem: Record<Register | 'cursor', number> = { a: 0, b: 0, c: initC, d: 0, cursor: 0 };

  const ops: Record<Command, (x: number | Register, y?: number | Register) => void> = {
    cpy: (x, y) => {
      mem[y as Register] = typeof x === 'number' ? x : mem[x];
      mem.cursor += 1;
    },
    inc: (x) => {
      mem[x as Register] += 1;
      mem.cursor += 1;
    },
    dec: (x) => {
      mem[x as Register] -= 1;
      mem.cursor += 1;
    },
    jnz: (x, y) => {
      mem.cursor += (mem[x! as Register] !== 0) ? y as number : 1;
    },
  };

  const instructions: [
    Command,
    number | Register,
    number | Register | undefined,
  ][] = split(input).map((line) => {
    const [op, xRaw, yRaw] = line.split(' ');

    const xParsed = parseInt(xRaw, 10);
    const yParsed = parseInt(yRaw, 10);

    const x = Number.isNaN(xParsed) ? xRaw as Register : xParsed;
    const y = Number.isNaN(yParsed) ? yRaw as Register : yParsed;

    return [op as Command, x, y];
  });

  while (mem.cursor < instructions.length) {
    circuitBreaker(100000000);
    const cmd = instructions[mem.cursor];
    ops[cmd[0]](cmd[1], cmd[2]);
  }

  return mem.a;
};

export const part1 = solve;

export const part2 = (input: string): number => solve(input, 1);
