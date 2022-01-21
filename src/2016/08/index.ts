import { split } from '@lib/processing';

const W = 50;
const H = 6;

type Command = 'rect' | 'column' | 'row';
type Step = { cmd: Command, a: number, b: number };
type Field = number[][];

const countLit = (field: Field): number => field.reduce(
  (rowAcc, row) => rowAcc + row.reduce((colAcc, col) => colAcc + col, 0),
  0,
);

const stringify = (field: Field): string => field.map((row) => row.map((v) => (v ? '#' : '.')).join('')).join('\n');

const apply: Record<Command, (field: Field, a: number, b: number) => void> = {
  rect: (f, w, h) => {
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        f[y][x] = 1;
      }
    }
  },
  column: (f, col, n) => {
    const nextIndices: number[] = [];
    for (let y = 0; y < f.length; y += 1) {
      nextIndices[(y + n) % f.length] = f[y][col];
    }

    for (let y = 0; y < nextIndices.length; y += 1) {
      f[y][col] = nextIndices[y];
    }
  },
  row: (f, row, n) => {
    const next: number[] = [];

    for (let x = 0; x < f[0].length; x += 1) {
      next[(x + n) % f[0].length] = f[row][x];
    }

    f[row] = next;
  },
};

const solve = (input: string, w = W, h = H): Field => {
  const field: Field = new Array(h).fill(null).map(() => new Array(w).fill(0));

  const steps: Step[] = split(input).map((line) => {
    const [, cmd, aRaw, bRaw] = line.match(/(rect|column|row)[^\d]+(\d+)[^\d]+(\d+)/)!;

    return {
      cmd: cmd as Command,
      a: parseInt(aRaw, 10),
      b: parseInt(bRaw, 10),
    };
  });

  for (let i = 0; i < steps.length; i += 1) {
    const s = steps[i];
    apply[s.cmd](field, s.a, s.b);
  }

  return field;
};

export const part1 = (input: string): number => countLit(solve(input));
export const part2 = (input: string): string => stringify(solve(input));
