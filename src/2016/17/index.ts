import crypto from 'crypto';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

/*
Positions:

  0 1 2 3
  4 5 6 7
  8 9 a b
  c d e f

state = [pos][passcode][steps]
*/

interface StateNode extends INode<number, string> { value: string }
type Coord = [number, number];

const ROOMS: { BY_COORD: string[][], BY_CODE: Record<string | number, Coord> } = {
  // [y][x] = 'b'
  BY_COORD: [
    ['0', '1', '2', '3'],
    ['4', '5', '6', '7'],
    ['8', '9', 'a', 'b'],
    ['c', 'd', 'e', 'f'],
  ],
  // b: [y, x]
  BY_CODE: {
    0: [0, 0],
    1: [0, 1],
    2: [0, 2],
    3: [0, 3],
    4: [1, 0],
    5: [1, 1],
    6: [1, 2],
    7: [1, 3],
    8: [2, 0],
    9: [2, 1],
    a: [2, 2],
    b: [2, 3],
    c: [3, 0],
    d: [3, 1],
    e: [3, 2],
    f: [3, 3],
  },
};

const TARGET_CODE = 'f';

const MAX_INDEX = 3;

const NEIGHBOURS: [string, Coord][] = [
  ['U', [-1, 0]],
  ['D', [1, 0]],
  ['L', [0, -1]],
  ['R', [0, 1]],
];

const OPEN = new Set(['b', 'c', 'd', 'e', 'f']);

const clampToBounds = (n: number): number => (n < 0 ? 0 : (n > MAX_INDEX ? MAX_INDEX : n));

const getHash = (str: string): string => {
  const MD5 = crypto.createHash('md5');
  MD5.update(str);
  return MD5.digest('hex');
};

const solve = (input: string, findLongest = false): string | number => {
  const passcode = input.trim();

  const initialState = `0${passcode}`;
  const solutions: string[] = [];

  const toCheck: FibonacciHeap<number, string> = new FibonacciHeap();
  toCheck.insert(0, initialState);

  while (!toCheck.isEmpty()) {
    const cur = toCheck.extractMinimum()! as StateNode;
    const existing = cur.value.slice(1);
    const hash = getHash(existing);

    const pos = ROOMS.BY_CODE[cur.value[0]]!;

    for (let i = 0; i < 4; i += 1) {
      if (!OPEN.has(hash[i])) { continue; }

      const neighbour = NEIGHBOURS[i];

      const ny = clampToBounds(pos[0] + neighbour[1][0]);
      const nx = clampToBounds(pos[1] + neighbour[1][1]);

      // Hit the exterior wall
      if (ny === pos[0] && nx === pos[1]) { continue; }

      const cost = cur.key + 1;
      const nextCode = ROOMS.BY_COORD[ny][nx];
      const next = `${nextCode}${existing}${neighbour[0]}`;

      if (nextCode === TARGET_CODE) {
        const path = next.slice(1 + input.length);
        if (!findLongest) {
          return path;
        }

        solutions.push(path);
      } else {
        toCheck.insert(cost, next);
      }
    }
  }

  return solutions[solutions.length - 1].length;
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, true) as number;
