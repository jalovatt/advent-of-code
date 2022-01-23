import { split } from '@lib/processing';

type Binary = 1 | 0;
type Field = Record<string, Binary>;

const WINDOW = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

/*
  - Hashing with a string like `${y},${x}` is surprisingly slow. If we know the max
  value M that will need to be hashed, we can just multiply y by something larger
  than M and store them both in a single number

  - y << 8 is a faster y * 255
*/
const getKey = (y: number, x: number) => (y << 8) + x;

const getWindowValue = (y: number, x: number, field: Field, infiniteAreLit: boolean): number => {
  const digits = [];
  for (let i = 0; i < WINDOW.length; i += 1) {
    digits.push(field[getKey(y + WINDOW[i][0], x + WINDOW[i][1])] ?? (infiniteAreLit ? 1 : 0));
  }

  return parseInt(digits.join(''), 2);
};

const countLit = (field: Field) => Object.values(field).reduce((l, r) => l + r, 0 as number);

const run = (input: string, times = 2): number => {
  const [algo,, ...rawImage] = split(input);

  let field: Field = {};

  rawImage.forEach((row, y) => row.split('').forEach((v, x) => { field[getKey(y, x)] = (v === '#' ? 1 : 0); }));

  let bounds = {
    yMin: 0,
    yMax: rawImage.length - 1,
    xMin: 0,
    xMax: rawImage[0].length - 1,
  };

  const infinitesToggle = (algo[0] === '#' && algo[algo.length - 1] === '.');

  for (let i = 0; i < times; i += 1) {
    const next: Field = {};
    const nextBounds = { ...bounds };
    const infiniteAreLit = i % 2 !== 0 && infinitesToggle;

    for (let y = bounds.yMin - 1; y <= bounds.yMax + 1; y += 1) {
      for (let x = bounds.xMin - 1; x <= bounds.xMax + 1; x += 1) {
        const wv = getWindowValue(y, x, field, infiniteAreLit);
        const v = algo[wv] === '#' ? 1 : 0;
        next[getKey(y, x)] = v;

        if (v) {
          if (y < nextBounds.yMin) {
            nextBounds.yMin = y;
          } else if (y > nextBounds.yMax) {
            nextBounds.yMax = y;
          }

          if (x < nextBounds.xMin) {
            nextBounds.xMin = x;
          } else if (x > nextBounds.xMax) {
            nextBounds.xMax = x;
          }
        }
      }
    }

    field = next;
    bounds = nextBounds;
  }

  return countLit(field);
};

export const a = (input: string) => run(input, 2);
export const b = (input: string) => run(input, 50);
