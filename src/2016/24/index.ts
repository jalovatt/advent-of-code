import CircuitBreaker from '@lib/CircuitBreaker';
import { inspect, log } from '@lib/logging';
import { split } from '@lib/processing';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

type Field = boolean[][];

// [y, x]
type Pos = [number, number];
type Bounds = [Pos, Pos];
type State = [Pos, Set<Pos>, number];
interface StateNode extends INode<number, State> { value: State }

const NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const memoizedPositions: Record<number, Record<number, Pos>> = {};
const getMemoizedPosition = (y: number, x: number): Pos => {
  if (!memoizedPositions[y]?.[x]) {
    if (!memoizedPositions[y]) { memoizedPositions[y] = {}; }
    memoizedPositions[y][x] = [y, x];
  }

  return memoizedPositions[y][x];
};

const manhattan = (a: Pos, b: Pos): number => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const parseInput = (input: string): [Field, Pos[]] => {
  const locations: Pos[] = [];

  const field = split(input).map((line, y) => line.split('').map((c, x) => {
    if (c.match(/\d/)) {
      locations[parseInt(c, 10)] = getMemoizedPosition(y, x);
    }

    return c !== '#';
  }));

  return [field, locations];
};

const getBoundingRectangle = (a: Pos, b: Pos, padding: number): [Pos, Pos] => {
  const yMin = a[0] < b[0] ? a[0] : b[0];
  const xMin = a[1] < b[1] ? a[1] : b[1];

  const yMax = a[0] > b[0] ? a[0] : b[0];
  const xMax = a[1] > b[1] ? a[1] : b[1];

  return [[yMin - padding, xMin - padding], [yMax + padding, xMax + padding]];
};

const isWithinBounds = (y: number, x: number, bounds: Bounds): boolean => (
  y >= bounds[0][0] && y <= bounds[1][0] && x >= bounds[0][1] && x <= bounds[1][1]
);

const findCost = (a: Pos, b: Pos, field: Field): number => {
  // Limiting how far afield we can get; just an assumption from looking at the map
  const searchBounds = getBoundingRectangle(a, b, 20);

  const toCheck: FibonacciHeap<number, State> = new FibonacciHeap();
  toCheck.insert(0, [a, new Set([a]), 0]);

  const breaker = new CircuitBreaker(1000000, (l, v) => {
    log(`${l} to check, last was ${inspect(v)}`);
  });

  const allVisited = new Set();

  while (!toCheck.isEmpty()) {
    const cur = toCheck.extractMinimum()! as StateNode;
    breaker.tick(toCheck.size(), cur.value);

    for (let i = 0; i < NEIGHBOURS.length; i += 1) {
      const ny = cur.value[0][0] + NEIGHBOURS[i][0];
      const nx = cur.value[0][1] + NEIGHBOURS[i][1];

      if (!field[ny][nx] || !isWithinBounds(ny, nx, searchBounds)) { continue; }

      const nPos = getMemoizedPosition(ny, nx);

      if (allVisited.has(nPos)) { continue; }

      const cost = cur.value[2] + 1;

      if (nPos === b) {
        return cost;
      }

      const visited = new Set(cur.value[1]);
      visited.add(nPos);
      allVisited.add(nPos);
      toCheck.insert(cost + manhattan(nPos, b), [nPos, visited, cost]);
    }
  }

  throw new Error(`Unable to reach ${b} from ${a}`);
};

const countOpenNeighbours = (y: number, x: number, field: Field): number => {
  let count = 0;

  for (let i = 0; i < NEIGHBOURS.length; i += 1) {
    if (field[y + NEIGHBOURS[i][0]][x + NEIGHBOURS[i][1]]) {
      count += 1;
    }
  }

  return count;
};

const mutFillDeadEnds = (field: Field, locations: Pos[]) => {
  const locationSet: Set<Pos> = new Set(locations);
  const toCheck: Pos[] = [];

  // Enqueue all positions w/ 3 walls that aren't a location
  for (let y = 1; y < field.length - 1; y += 1) {
    for (let x = 1; x < field[0].length - 1; x += 1) {
      if (!field[y][x]) { continue; }

      const openNeighbours = countOpenNeighbours(y, x, field);

      if (openNeighbours === 1) {
        const pos = getMemoizedPosition(y, x);
        if (!locationSet.has(pos)) {
          toCheck.push(pos);
        }
      }
    }
  }

  while (toCheck.length) {
    const cur = toCheck.pop()!;
    field[cur[0]][cur[1]] = false;

    for (let i = 0; i < NEIGHBOURS.length; i += 1) {
      const ny = cur[0] + NEIGHBOURS[i][0];
      const nx = cur[1] + NEIGHBOURS[i][1];

      if (!field[ny][nx]) { continue; }

      const openNeighbours = countOpenNeighbours(ny, nx, field);

      if (openNeighbours === 1) {
        const pos = getMemoizedPosition(ny, nx);
        if (!locationSet.has(pos)) {
          toCheck.push(pos);
        }
      }
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (field: Field, locations: Pos[]) => {
  const locationField: any[][] = [];

  locations.forEach((l, i) => {
    if (!locationField[l[0]]) { locationField[l[0]] = []; }
    locationField[l[0]][l[1]] = i;
  });

  const out = field.map((row, y) => row.map((v, x) => {
    if (locationField[y]?.[x] !== undefined) {
      return `\x1b[7m${locationField[y][x]}\x1b[0m`;
    }

    return v ? '.' : '#';
  }).join('')).join('\n');

  log(out);
};

type Permutation = [number, Set<number>];
interface PermutationNode extends INode<number, Permutation> { value: Permutation }

export const solve = (input: string, isRoundTrip = false): number => {
  const [field, locations] = parseInput(input);

  mutFillDeadEnds(field, locations);

  // Get the pairwise distances between each location
  const costs: Map<number, Map<number, number>> = new Map();
  for (let i = 0; i < locations.length - 1; i += 1) {
    for (let j = i + 1; j < locations.length; j += 1) {
      const cost = findCost(locations[i], locations[j], field);

      if (!costs.has(i)) { costs.set(i, new Map()); }
      costs.get(i)!.set(j, cost);

      if (!costs.has(j)) { costs.set(j, new Map()); }
      costs.get(j)!.set(i, cost);
    }
  }

  const toCheck: FibonacciHeap<number, Permutation> = new FibonacciHeap();
  toCheck.insert(0, [0, new Set([0])]);

  const paths: [number, Permutation][] = [];

  // BFS the pairwise distances until all locations have been visited
  while (!toCheck.isEmpty()) {
    const cur = toCheck.extractMinimum()! as PermutationNode;

    if (cur.value[1].size === locations.length) {
      if (!isRoundTrip) {
        return cur.key;
      }

      paths.push([cur.key, cur.value]);
    }

    for (let i = 0; i < locations.length; i += 1) {
      if (cur.value[1].has(i)) { continue; }

      const cost = cur.key + costs.get(cur.value[0])!.get(i)!;
      const nextVisited = new Set(cur.value[1]);
      nextVisited.add(i);

      toCheck.insert(cost, [i, nextVisited]);
    }
  }

  const roundTripCosts = paths.map((p) => {
    const at = p[1][0];
    const addedCost = costs.get(at)!.get(0)!;

    return p[0] + addedCost;
  });

  return roundTripCosts.sort((a, b) => a - b)[0];
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, true);
