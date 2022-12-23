/* eslint-disable no-multi-spaces */
import { log } from '@lib/logging';
import { split } from '@lib/processing';

// x, y
type Pos = [number, number];

/*
  Used a slower ${x},${y} to solve, then checked the range of values involved
  to determine a suitable shift and offset (to avoid dealing with negatives)
*/
const hash = (x: number, y: number) => (x + 100) * 1000 + (y + 100);

const ALL_NEIGHBOURS = [
  [0, -1],    // N  128
  [1, -1],    // NE 64
  [1, 0],     // E  32
  [1, 1],     // SE 16
  [0, 1],     // S  8
  [-1, 1],    // SW 4
  [-1, 0],    // W  2
  [-1, -1],   // NW 1
];

// [x, y, sum of bit + adjacent bits]
const NEIGHBOURS = [
  [0, -1, 193],    // N
  [0, 1, 28],     // S
  [-1, 0, 7],    // W
  [1, 0, 112],     // E
];

const getNeighbourState = (e: Pos, elfPositions: Set<number>) => {
  let s = 0;

  for (let i = 0; i < ALL_NEIGHBOURS.length; i += 1) {
    const n = ALL_NEIGHBOURS[i];

    const x = e[0] + n[0];
    const y = e[1] + n[1];

    s = (s << 1) + (elfPositions.has(hash(x, y)) ? 1 : 0);
  }

  return s;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (elves: Pos[]) => {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  elves.forEach((e) => {
    xMin = e[0] < xMin ? e[0] : xMin;
    xMax = e[0] > xMax ? e[0] : xMax;
    yMin = e[1] < yMin ? e[1] : yMin;
    yMax = e[1] > yMax ? e[1] : yMax;
  });

  const out = new Array(1 + yMax - yMin).fill(null).map(() => new Array(1 + xMax - xMin).fill('.'));

  elves.forEach((e) => {
    out[e[1] - yMin][e[0] - xMin] = '#';
  });

  log('');
  log(out.map((row) => row.join('')).join('\n'));
  log('');
};

const parseInput = (input: string): [Pos[], Set<number>] => {
  const elves: Pos[] = [];
  const elfPositions: Set<number> = new Set();

  split(input, '\n').forEach((line, y) => line.split('').forEach((char, x) => {
    if (char === '#') {
      elves.push([x, y]);
      elfPositions.add(hash(x, y));
    }
  }));

  return [elves, elfPositions];
};

const step = (elves: Pos[], elfPositions: Set<number>, nStep: number): boolean => {
  const elfTargets: Map<number, number> = new Map();
  const elfTargetCount: Map<number, number> = new Map();

  let elvesMoved = false;

  // Choose
  for (let j = 0; j < elves.length; j += 1) {
    const e = elves[j];
    const neighbourState = getNeighbourState(e, elfPositions);

    // No neighbours? No move.
    if (neighbourState === 0) {
      continue;
    }

    for (let k = 0; k < NEIGHBOURS.length; k += 1) {
      /*
        The elves cycle the starting direction by 1 when choosing moves each round.
      */
      const nIndex = (nStep + k) % NEIGHBOURS.length;

      // If none of the bits in this neighbour's mask are on in the state,
      // we're okay to move there.
      if ((neighbourState & NEIGHBOURS[nIndex][2]) === 0) {
        const x = e[0] + NEIGHBOURS[nIndex][0];
        const y = e[1] + NEIGHBOURS[nIndex][1];

        const key = hash(x, y);

        elfTargets.set(j, nIndex);
        elfTargetCount.set(key, (elfTargetCount.get(key) ?? 0) + 1);

        break;
      }
    }
  }

  // Move
  for (let j = 0; j < elves.length; j += 1) {
    const e = elves[j];
    const ti = elfTargets.get(j);

    if (ti !== undefined) {
      const x = e[0] + NEIGHBOURS[ti][0];
      const y = e[1] + NEIGHBOURS[ti][1];

      const key = hash(x, y);

      if (elfTargetCount.get(key) === 1) {
        elfPositions.delete(hash(e[0], e[1]));
        e[0] = x;
        e[1] = y;
        elfPositions.add(hash(e[0], e[1]));
        elvesMoved = true;
        continue;
      }
    }

    // If this elf didn't move, make sure we still add its position
    elfPositions.add(hash(e[0], e[1]));
  }

  return elvesMoved;
};

const getBoundingRectangle = (elves: Pos[]): [Pos, Pos] => {
  let yMin = Infinity;
  let yMax = -Infinity;
  let xMin = Infinity;
  let xMax = -Infinity;

  for (let i = 0; i < elves.length; i += 1) {
    const [x, y] = elves[i];
    xMin = x < xMin ? x : xMin;
    xMax = x > xMax ? x : xMax;
    yMin = y < yMin ? y : yMin;
    yMax = y > yMax ? y : yMax;
  }

  return [[xMin, yMin], [xMax, yMax]];
};

export const part1 = (input: string): number => {
  const [elves, elfPositions] = parseInput(input);

  for (let i = 0; i < 10; i += 1) {
    step(elves, elfPositions, i);
  }

  const [[xMin, yMin], [xMax, yMax]] = getBoundingRectangle(elves);

  return (1 + xMax - xMin) * (1 + yMax - yMin) - elves.length;
};

export const part2 = (input: string): number => {
  const [elves, elfPositions] = parseInput(input);

  let round = 0;
  let elvesMoved = false;
  do {
    elvesMoved = step(elves, elfPositions, round);

    round += 1;
  } while (elvesMoved);

  return round;
};
