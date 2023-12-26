import { split } from '@lib/processing';

const BIT_MASK_8 = (2 ** 8) - 1;
const encodePos = (x: number, y: number) => (y << 8) + x;

const decodePos: Record<string, (p: number) => number> = {
  x: (p) => p & BIT_MASK_8,
  y: (p) => (p >>> 8) & BIT_MASK_8,
};

type Parsed = {
  field: boolean[][];
  nRows: number;
  nCols: number;
  start: number;
};

const parseInput = (input: string): Parsed => {
  const lines = split(input);
  const nRows = lines.length;
  const nCols = lines[0].length;

  let start: number;
  const field = lines.map((line, y) => line.split('').map((char, x) => {
    if (char === 'S') {
      start = encodePos(x, y);
    }
    return char === '#';
  }));

  return { field, nRows, nCols, start: start! };
};

export const part1 = (input: string, steps: number): number => {
  const { field, nRows, nCols, start } = parseInput(input);

  let positions: Set<number> = new Set([start]);
  let next: Set<number>;

  const moveTo = (x: number, y: number) => {
    if (!field[y][x]) {
      next.add(encodePos(x, y));
    }
  };

  for (let i = 0; i < steps; i += 1) {
    next = new Set();

    for (const p of positions.values()) {
      const y = decodePos.y(p);
      const x = decodePos.x(p);

      if (y > 0) {
        moveTo(x, y - 1);
      }

      if (y < nRows - 1) {
        moveTo(x, y + 1);
      }

      if (x > 0) {
        moveTo(x - 1, y);
      }

      if (x < nCols - 1) {
        moveTo(x + 1, y);
      }
    }

    positions = next;
  }

  return positions.size;
};

export const part2 = (input: string, steps: number): number => {};
