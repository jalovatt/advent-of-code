import { split, splitToNumber } from '@lib/processing';

type Coord = [number, number];
type Fold = ['x' | 'y', number];

type DotGrid = boolean[][];

const EMPTY = '.';
const FILLED = '█';

const getNewGrid = (height: number, width: number): DotGrid => (
  new Array(height).fill(null).map(() => new Array(width).fill(false))
);

const generate = (coords: Coord[]): DotGrid => {
  const bounds = coords.reduce((acc, cur) => {
    acc[0] = Math.max(acc[0], cur[0]); // x
    acc[1] = Math.max(acc[1], cur[1]); // y

    return acc;
  }, [0, 0]);

  const arr = getNewGrid(bounds[1] + 1, bounds[0] + 1);

  for (let i = 0; i < coords.length; i += 1) {
    const point = coords[i];

    arr[point[1]][point[0]] = true;
  }

  return arr;
};

const fold = {
  y: (arr: DotGrid, pivot: number) => {
    const folded = getNewGrid(pivot, arr[0].length);

    for (let y = 0; y < pivot; y += 1) {
      for (let x = 0; x < arr[0].length; x += 1) {
        const target = pivot - (y - pivot);

        if (target > -1) {
          folded[y][x] = arr[target]?.[x] || arr[y][x];
        }
      }
    }

    return folded;
  },
  x: (arr: DotGrid, pivot: number) => {
    const folded = getNewGrid(arr.length, pivot);

    for (let y = 0; y < arr.length; y += 1) {
      for (let x = 0; x < pivot; x += 1) {
        const target = pivot - (x - pivot);

        if (target > -1) {
          folded[y][x] = arr[y][target] || arr[y][x];
        }
      }
    }

    return folded;
  },
};

const applyFold = (arr: DotGrid, f: Fold): DotGrid => fold[f[0]](arr, f[1]);

const countMarked = (arr: DotGrid) => {
  let count = 0;

  for (let y = 0; y < arr.length; y += 1) {
    for (let x = 0; x < arr[0].length; x += 1) {
      if (arr[y][x]) { count += 1; }
    }
  }

  return count;
};

const print = (arr: DotGrid) => {
  const str = arr.map((row) => row.map((v) => (v ? FILLED : EMPTY)).join('')).join('\n');

  // eslint-disable-next-line no-console
  console.log(str);
};

const processInput = (input: string): [Coord[], Fold[]] => {
  const [rawCoords, rawFolds] = split(input, '\n\n');
  const coords = split(rawCoords).map((v) => splitToNumber(v, ',')) as Coord[];

  const folds = split(rawFolds).map((v) => {
    const match = v.match(/(x|y)=(\d+)/)!;

    return [match[1], parseInt(match[2], 10)] as Fold;
  });

  return [coords, folds];
};

export const a = (input: string) => {
  const [coords, folds] = processInput(input);

  const initial = generate(coords);
  const folded = applyFold(initial, folds[0]);
  const count = countMarked(folded);

  return count;
};

export const b = (input: string) => {
  const [coords, folds] = processInput(input);

  let folded = generate(coords);

  folds.forEach((f) => {
    folded = applyFold(folded, f);
  });

  print(folded);
};
