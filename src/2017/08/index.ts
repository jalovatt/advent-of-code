import { split } from '@lib/processing';

type Command = 'inc' | 'dec';
type Comparison = '>' | '<' | '>=' | '<=' | '==' | '!=';

const compare: Record<Comparison, (a: number, b: number) => boolean> = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b,
};

export const part1 = (input: string, wantLargestSeen = false): number => {
  const mem: Record<string, number> = {};
  let max = 0;

  const get = (k: string): number => {
    if (mem[k] === undefined) {
      mem[k] = 0;
    }

    return mem[k];
  };

  const set = (k: string, v: number) => {
    mem[k] = v;

    if (v > max) { max = v; }
  };

  split(input).forEach((line) => {
    const match = line.match(/(\w+) (inc|dec) ([-\d]+) if (\w+) ([<>=!]+) ([-\d]+)/);
    if (!match) {
      throw new Error(`Couldn't match line: ${line}`);
    }

    const [, dest, cmd, deltaRaw, a, cmp, bRaw] = match;

    const delta = parseInt(deltaRaw, 10);
    const b = parseInt(bRaw, 10);

    if (compare[cmp as Comparison](get(a), b)) {
      set(dest, get(dest) + (cmd === 'inc' ? delta : -delta));
    }

    return { dest, cmd: cmd as Command, delta, a, cmp: cmp as Comparison, b };
  });

  return wantLargestSeen
    ? max
    : Object.values(mem).sort((a, b) => b - a)[0];
};

export const part2 = (input: string): number => part1(input, true);
