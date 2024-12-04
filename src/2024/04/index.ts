import { split } from '@lib/processing';

const check1 = (rows: string[], y: number, x: number): number => {
  if (rows[y][x] !== 'X') {
    return 0;
  }

  let count = 0;

  // N
  if (rows[y - 1]?.[x] === 'M' && rows[y - 2]?.[x] === 'A' && rows[y - 3]?.[x] === 'S') {
    count += 1;
  }

  // NE
  if (rows[y - 1]?.[x + 1] === 'M' && rows[y - 2]?.[x + 2] === 'A' && rows[y - 3]?.[x + 3] === 'S') {
    count += 1;
  }

  // E
  if (rows[y][x + 1] === 'M' && rows[y][x + 2] === 'A' && rows[y][x + 3] === 'S') {
    count += 1;
  }

  // SE
  if (rows[y + 1]?.[x + 1] === 'M' && rows[y + 2]?.[x + 2] === 'A' && rows[y + 3]?.[x + 3] === 'S') {
    count += 1;
  }

  // S
  if (rows[y + 1]?.[x] === 'M' && rows[y + 2]?.[x] === 'A' && rows[y + 3]?.[x] === 'S') {
    count += 1;
  }

  // SW
  if (rows[y + 1]?.[x - 1] === 'M' && rows[y + 2]?.[x - 2] === 'A' && rows[y + 3]?.[x - 3] === 'S') {
    count += 1;
  }

  // W
  if (rows[y][x - 1] === 'M' && rows[y][x - 2] === 'A' && rows[y][x - 3] === 'S') {
    count += 1;
  }

  // NW
  if (rows[y - 1]?.[x - 1] === 'M' && rows[y - 2]?.[x - 2] === 'A' && rows[y - 3]?.[x - 3] === 'S') {
    count += 1;
  }

  return count;
};

const check2 = (rows: string[], y: number, x: number): number => {
  if (rows[y][x] !== 'A') {
    return 0;
  }

  const NWSE = (
    (rows[y - 1]?.[x - 1] === 'M' && rows[y + 1]?.[x + 1] === 'S')
    || (rows[y + 1]?.[x + 1] === 'M' && rows[y - 1]?.[x - 1] === 'S')
  );

  const NESW = (
    (rows[y - 1]?.[x + 1] === 'M' && rows[y + 1]?.[x - 1] === 'S')
    || (rows[y + 1]?.[x - 1] === 'M' && rows[y - 1]?.[x + 1] === 'S')
  );

  return NWSE && NESW ? 1 : 0;
};

export const part1 = (input: string): number => {
  const rows = split(input);

  let count = 0;

  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows.length; x += 1) {
      count += check1(rows, y, x);
    }
  }

  return count;
};

export const part2 = (input: string): number => {
  const rows = split(input);

  let count = 0;

  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows.length; x += 1) {
      count += check2(rows, y, x);
    }
  }

  return count;
};
