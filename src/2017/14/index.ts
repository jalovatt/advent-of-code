import { part2 as knotHash } from '../10';

const NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

// y, x
type Pos = [number, number];
type Field = (string | number)[][];

const getField = (input: string): Field => new Array(128).fill(null).map((_, i) => {
  const hash = knotHash(`${input}-${i}`);

  const arr: string[] = [];

  for (let j = 0; j < hash.length; j += 1) {
    const c = hash[j];
    arr.push(...parseInt(c, 16).toString(2).padStart(4, '0'));
  }

  return arr;
});

export const part1 = (input: string): number => {
  const field = getField(input);

  return field.flat().reduce((acc: number, cur) => acc + (cur === '1' ? 1 : 0), 0);
};

export const part2 = (input: string): number => {
  const field = getField(input);

  let region = 0;

  const fillRegion = (pos: Pos) => {
    field[pos[0]][pos[1]] = region;

    const toCheck: Pos[] = [pos];
    while (toCheck.length) {
      const cur = toCheck.pop()!;

      for (let i = 0; i < NEIGHBOURS.length; i += 1) {
        const ny = cur[0] + NEIGHBOURS[i][0];
        const nx = cur[1] + NEIGHBOURS[i][1];

        if (ny < 0 || ny >= 128 || nx < 0 || nx >= 128) {
          continue;
        }

        if (field[ny][nx] === '1') {
          field[ny][nx] = region;
          toCheck.push([ny, nx]);
        }
      }
    }
  };

  for (let y = 0; y < 128; y += 1) {
    for (let x = 0; x < 128; x += 1) {
      if (field[y][x] === '1') {
        region += 1;
        fillRegion([y, x]);
      }
    }
  }

  return region;
};
