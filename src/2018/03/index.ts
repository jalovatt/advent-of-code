import { split } from '@lib/processing';

type Field = number[][];

// l t w h
type Claim = { id: number, l: number, t: number, w: number, h: number };

const parseInput = (input: string): Claim[] => split(input).map((line) => {
  const [id, l, t, w, h] = line.match(/\d+/g)!
    .map((n) => parseInt(n, 10));

  return { id, l, t, w, h };
});

const getField = (claims: Claim[]): [Field, number] => {
  const field = new Array(1000).fill(null).map(() => new Array(1000).fill(0));

  let count = 0;
  claims.forEach((c) => {
    for (let y = c.t; y < c.t + c.h; y += 1) {
      for (let x = c.l; x < c.l + c.w; x += 1) {
        if (field[y][x] === 1) {
          count += 1;
        }

        field[y][x] += 1;
      }
    }
  });

  return [field, count];
};

export const part1 = (input: string): number => {
  const claims = parseInput(input);
  const [, count] = getField(claims);

  return count;
};

export const part2 = (input: string): number => {
  const claims = parseInput(input);
  const [field] = getField(claims);

  mainLoop:
  for (let i = 0; i < claims.length; i += 1) {
    const c = claims[i];

    for (let y = c.t; y < c.t + c.h; y += 1) {
      for (let x = c.l; x < c.l + c.w; x += 1) {
        if (field[y][x] > 1) { continue mainLoop; }
      }
    }

    return c.id;
  }

  throw new Error('No claims were uncontested');
};
