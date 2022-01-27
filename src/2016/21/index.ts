import { split } from '@lib/processing';

type Step = { op: string, x: string, y?: string };

const operations: Record<string, (arr: string[], x: any, y?: any) => string[]> = {
  'swap position': (arr, x: number, y: number) => {
    const a = arr[x];
    const b = arr[y];
    arr[x] = b;
    arr[y] = a;

    return arr;
  },
  'swap letter': (arr, x: string, y: string) => {
    const a = arr.indexOf(x);
    const b = arr.indexOf(y);

    arr[a] = y;
    arr[b] = x;

    return arr;
  },
  'rotate left': (arr, x: number) => {
    const next = [];

    for (let i = 0; i < arr.length; i += 1) {
      next[(i - x + arr.length) % arr.length] = arr[i];
    }

    return next;
  },
  'rotate right': (arr, x: number) => {
    const next = [];

    for (let i = 0; i < arr.length; i += 1) {
      next[(i + x) % arr.length] = arr[i];
    }

    return next;
  },
  'rotate based': (arr, x: string) => {
    const a = arr.indexOf(x);
    const r = 1 + a + (a >= 4 ? 1 : 0);

    const next = [];

    for (let i = 0; i < arr.length; i += 1) {
      next[(i + r) % arr.length] = arr[i];
    }

    return next;
  },
  'reverse positions': (arr, x: number, y: number) => {
    const next = [...arr];

    for (let i = x; i <= y; i += 1) {
      next[i] = arr[y - (i - x)];
    }

    return next;
  },
  'move position': (arr, x: number, y: number) => {
    if (y > x) {
      const a = arr[x];
      for (let i = x; i < y; i += 1) {
        arr[i] = arr[i + 1];
      }

      arr[y] = a;
    } else {
      const a = arr[x];
      for (let i = x; i > y; i -= 1) {
        arr[i] = arr[i - 1];
      }

      arr[y] = a;
    }

    return arr;
  },
} as const;

const reverseOperations: Record<string, (arr: string[], x: any, y?: any) => string[]> = {
  'rotate left': operations['rotate right'],
  'rotate right': operations['rotate left'],
  'rotate based': (arr, x: string) => {
    /*
      Was stuck on this one, even with the pattern written out by hand.
      Cheers to Reddit for pointing out that if a is even, the letter was originally
      in the second half of the array.
    */
    const a = arr.indexOf(x);
    const parityOffset = (a % 2) ? 0 : (arr.length / 2 + 1);

    const r = a === 0
      ? (arr.length / 2)
      : ((a + 1) / 2) >> 0;

    const next = [];

    for (let i = 0; i < arr.length; i += 1) {
      next[(i - r - parityOffset + 2 * arr.length) % arr.length] = arr[i];
    }

    return next;
  },
  'move position': (arr, x: number, y: number) => operations['move position'](arr, y, x),
};

const getSteps = (input: string): Step[] => split(input).map((line) => {
  const [, op, xRaw, yRaw] = line.match(/^(\w+ \w+).+?\b(\w|\d)\b.*? ?\b(\w|\d)?$/)!;

  const xParsed = parseInt(xRaw, 10);
  const yParsed = parseInt(yRaw, 10);
  return {
    op,
    x: !Number.isNaN(xParsed) ? xParsed : xRaw,
    y: yRaw ? (!Number.isNaN(yParsed) ? yParsed : yRaw) : undefined,
  } as Step;
});

export const part1 = (input: string, start: string): string => getSteps(input)
  .reduce((acc, { op, x, y }) => operations[op](acc, x, y), start.split('')).join('');

export const part2 = (input: string, start: string): string => getSteps(input)
  .reverse()
  .reduce((acc, { op, x, y }) => (
    (reverseOperations[op] || operations[op])(acc, x, y)
  ), start.split('')).join('');
