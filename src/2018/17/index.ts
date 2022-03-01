import CircuitBreaker from '@lib/CircuitBreaker';
import { log } from '@lib/logging';
import { split } from '@lib/processing';

// [y, x]
type Pos = [number, number];
type Bounds = [Pos, Pos];

enum State { Clay, Wet, Water }
type StateMap = Map<number, State>;

/*
  Max value is ~2000, so we can use 11 bits per axis:

  y           x
  00000000000 00000000000
*/

const encodePos = (y: number, x: number) => (y << 11) | x;
const decodePos = {
  x: (p: number) => p & 0b11111111111,
  y: (p: number) => p >>> 11,
};

const incrementPos = {
  x: (p: number, v: number) => p + v,
  y: (p: number, v: number) => p + (v * 2048),
};

const mapBounds = (map: StateMap): [Pos, Pos] => {
  const min: Pos = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
  const max: Pos = [1, 500];

  for (const entry of map.entries()) {
    const y = decodePos.y(entry[0]);
    if (y < min[0]) {
      min[0] = y;
    } else if (y > max[0]) {
      max[0] = y;
    }

    const x = decodePos.x(entry[0]);
    if (x < min[1]) {
      min[1] = x;
    } else if (x > max[1]) {
      max[1] = x;
    }
  }

  return [min, max];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (map: StateMap, bounds: [Pos, Pos]) => {
  const out: string[][] = [];

  for (let y = bounds[0][0]; y <= bounds[1][0]; y += 1) {
    const row: string[] = [];

    for (let x = bounds[0][1]; x <= bounds[1][1]; x += 1) {
      const p = encodePos(y, x);
      const v = map.get(p);

      const char = (v !== undefined)
        ? (v === State.Clay ? '#' : v === State.Wet ? '|' : '~')
        : '.';

      row.push(char);
    }

    out.push(row);
  }

  log(`${bounds[0]} to ${bounds[1]}`);
  log(out.map((row) => row.join('')).join('\n'));
};

const count = (map: StateMap, bounds: Bounds, onlyWater = false): number => {
  let n = 0;

  for (let y = bounds[0][0]; y <= bounds[1][0]; y += 1) {
    for (let x = bounds[0][1]; x <= bounds[1][1]; x += 1) {
      const state = map.get(encodePos(y, x));

      if (state && (state === State.Water || (!onlyWater && state === State.Wet))) {
        n += 1;
      }
    }
  }

  return n;
};

const updateBounds = (p: number, bounds: Bounds) => {
  const x = decodePos.x(p);

  if (x < bounds[0][1]) {
    bounds[0][1] = x;
  } else if (x > bounds[1][1]) {
    bounds[1][1] = x;
  }
};

const parseInput = (input: string): [Map<number, State>, Bounds] => {
  const map: Map<number, State> = new Map();

  split(input).forEach((line) => {
    const axis = line[0];
    const [axisValue, from, to] = line.match(/\d+/g)!.map((n) => parseInt(n, 10));

    for (let i = from; i <= to; i += 1) {
      const p = (axis === 'x')
        ? encodePos(i, axisValue)
        : encodePos(axisValue, i);

      map.set(p, State.Clay);
    }
  });

  return [map, mapBounds(map)];
};

/*
  Replace Wet in this row with Water, in both directions, noting any empty spaces
  below.
*/
const fillWater = (p: number, map: StateMap): number[] => {
  const toCheck: number[] = [];

  map.set(p, State.Water);

  let left = incrementPos.x(p, -1);
  while (map.get(left) === State.Wet) {
    map.set(left, State.Water);

    const below = incrementPos.y(left, 1);
    if (!map.has(below)) {
      toCheck.push(below);
    }

    left = incrementPos.x(left, -1);
  }

  let right = incrementPos.x(p, 1);
  while (map.get(right) === State.Wet) {
    map.set(right, State.Water);

    const below = incrementPos.y(right, 1);
    if (!map.has(below)) {
      toCheck.push(below);
    }

    right = incrementPos.x(right, 1);
  }

  return toCheck;
};

/*
  Fill this row with Wet, in both directions, until we hit clay or a space with
  nothing under it.
*/
const fillWet = (p: number, map: StateMap): number[] => {
  const ends: number[] = [];

  map.set(p, State.Wet);

  let left = incrementPos.x(p, -1);
  while (map.get(left) !== State.Clay) {
    map.set(left, State.Wet);

    if (!map.has(incrementPos.y(left, 1))) {
      ends.push(left);
      break;
    }

    left = incrementPos.x(left, -1);
  }

  let right = incrementPos.x(p, 1);
  while (map.get(right) !== State.Clay) {
    map.set(right, State.Wet);

    if (!map.has(incrementPos.y(right, 1))) {
      ends.push(right);
      break;
    }

    right = incrementPos.x(right, 1);
  }

  return ends;
};

const run = (input: string): [Map<number, State>, Bounds] => {
  const [map, bounds] = parseInput(input);

  const start = encodePos(0, 500);

  const toCheck: number[] = [start];

  const breaker = new CircuitBreaker(100000);
  while (toCheck.length) {
    breaker.tick();

    const cur = toCheck.shift()!;

    if (map.has(cur)) {
      continue;
    }

    map.set(cur, State.Wet);

    const down = incrementPos.y(cur, 1);
    const valueDown = map.get(down);
    if (valueDown === undefined) {
      if (decodePos.y(down) <= bounds[1][0]) {
        toCheck.push(down);

        updateBounds(down, bounds);
      }

      continue;
    } else if (valueDown === State.Wet) {
      continue;
    } else {
      const freeEnds = fillWet(cur, map);

      if (freeEnds.length > 0) {
        toCheck.push(...freeEnds.map((p) => incrementPos.y(p, 1)));

        for (let i = 0; i < freeEnds.length; i += 1) {
          updateBounds(freeEnds[i], bounds);
        }
      } else {
        // If this basin contains a basin, row-filling will have missed some spaces
        const below = fillWater(cur, map);
        toCheck.push(...below);

        const above = incrementPos.y(cur, -1);

        // Deleting to bypass our check for queueing positions we've visited
        map.delete(above);
        toCheck.push(above);
      }
    }
  }

  return [map, bounds];
};

export const part1 = (input: string): number => {
  const [map, bounds] = run(input);

  return count(map, bounds);
};
export const part2 = (input: string): number => {
  const [map, bounds] = run(input);

  return count(map, bounds, true);
};
