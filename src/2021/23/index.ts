import { FibonacciHeap } from '@tyriar/fibonacci-heap';
import type { INode } from '@tyriar/fibonacci-heap';
import { log } from '@lib/logging';
import { split } from '@lib/processing';
import CircuitBreaker from '@lib/CircuitBreaker';

type Letter = 'A' | 'B' | 'C' | 'D';
type PositionLetter = [number, Letter];
type DecodedState = PositionLetter[];

type GraphNode = [number, number?][];
type Graph = Record<number, GraphNode>;

// [pos, cumulative cost][]
type PathCost = [number, number][];

// Just specifying that value IS defined
export interface StateNode extends INode<number, string> { value: string }
export type StateNodes = Record<string, StateNode>;

/*
0   1   *   2   *   3   *   4   *   5   6
        7       8       9       10
        11      12      13      14
        15      16      17      18
        19      20      21      22

        A       B       C       D

col A = (n - 7) % 4 === 0
    B               === 1
    C               === 2
    D               === 3

hallway = n < 7

up/down in room = n +/- 4
*/

const graph: Graph = {
  0: [[1]],
  1: [[0], [2, 2], [7, 2]],
  2: [[1, 2], [7, 2], [8, 2], [3, 2]],
  3: [[2, 2], [8, 2], [9, 2], [4, 2]],
  4: [[3, 2], [9, 2], [5, 2], [10, 2]],
  5: [[4, 2], [10, 2], [6]],
  6: [[5]],
  7: [[1, 2], [2, 2], [11]],
  8: [[2, 2], [3, 2], [12]],
  9: [[3, 2], [4, 2], [13]],
  10: [[4, 2], [5, 2], [14]],
  11: [[7], [15]],
  12: [[8], [16]],
  13: [[9], [17]],
  14: [[10], [18]],
  15: [[11], [19]],
  16: [[12], [20]],
  17: [[13], [21]],
  18: [[14], [22]],
  19: [[15]],
  20: [[16]],
  21: [[17]],
  22: [[18]],
};

/*
  We can never stop on these positions (wrt the original map), so we can just
  ignore them and treat them as edges of weight 2
*/
const MAP_GAPS = [2, 4, 6, 8];

const TEMPLATE_A = `
#############
#.. . . . ..#
###.#.#.#.###
  #.#.#.#.#
  #########
`;

const TEMPLATE_B = `
#############
#.. . . . ..#
###.#.#.#.###
  #.#.#.#.#
  #.#.#.#.#
  #.#.#.#.#
  #########
`;

const TARGET_STATE_A = `
#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########
`;

const TARGET_STATE_B = `
#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########
`;

const PART_B_ADDITIONS = `
#D#C#B#A#
#D#B#A#C#
`;

const A_TARGET_ROW = 11;
const B_TARGET_ROW = 19;

const LETTERS = { A: true, B: true, C: true, D: true };
const LETTER_COSTS = { A: 1, B: 10, C: 100, D: 1000 };
const BASE_LETTER_TARGETS = { A: 11, B: 12, C: 13, D: 14 };
const LETTER_HOME_MODS = { A: 0, B: 1, C: 2, D: 3 };

const getCost = (letter: Letter, baseCost: number): number => baseCost * LETTER_COSTS[letter];
const isOwnRoom = (c: Letter, p: number) => (p - 7) % 4 === LETTER_HOME_MODS[c];
const isInHallway = (l: PositionLetter): boolean => l[0] < 7;

const isHome = (l: PositionLetter, strState: string, isB = false): boolean => {
  const p = l[0];
  const c = l[1];
  if (!isOwnRoom(c, p)) { return false; }

  if (p >= (isB ? B_TARGET_ROW : A_TARGET_ROW)) { return true; }
  if (strState[p + 4] === c) { return true; }

  return false;
};

const isStuckInRoom = (p: number, strState: string): boolean => {
  if (p < 11) { return false; }
  return strState[p - 4] !== '.';
};

const encodeState = (state: DecodedState) => {
  const arr = new Array(23).fill('.');

  for (let i = 0; i < state.length; i += 1) {
    arr[state[i][0]] = state[i][1];
  }

  return arr.join('');
};

const updateState = (strState: string, from: number, to: number): string => {
  const out = [];
  for (let i = 0; i < strState.length; i += 1) {
    out.push((
      i === from ? '.'
        : i === to ? strState[from]
          : strState[i]
    ));
  }
  return out.join('');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (state: string, isB = false) => {
  const chars = (isB ? TEMPLATE_B : TEMPLATE_A).trim().split('');

  let pos = 0;
  for (let i = 0; i < chars.length; i += 1) {
    if (chars[i] === '.') {
      chars[i] = state[pos];
      pos += 1;
    }
  }

  log(chars.join(''));
};

/*
  {
    [from]: {
      [to]: [[a, cost a], [b, cost a + b], ...]
    }
  }
*/
const cachedPaths: Record<number, Record<number, PathCost>> = {};
const findShortestPath = (s: number, t: number, c: Letter): PathCost => {
  if (cachedPaths[s]?.[t]) {
    return cachedPaths[s][t];
  }

  if (!cachedPaths[s]) { cachedPaths[s] = {}; }
  const toCheck: [number, number][][] = [[[s, 0]]];

  loop:
  while (toCheck.length) {
    // TODO: Check sort direction
    const cur = toCheck.sort((l, r) => r[r.length - 1][1] - l[l.length - 1][1]).pop()!;
    const pos = cur[cur.length - 1][0];
    const cost = cur[cur.length - 1][1];

    const edges = graph[pos];

    for (let i = 0; i < edges.length; i += 1) {
      const e = edges[i];
      const eTarget = e[0];

      // No backtracking
      if (cur.find((n) => n[0] === eTarget)) { continue; }

      // No travelling through rooms if you're moving in the hallway
      if (eTarget > 6 && eTarget > pos && t < 7) { continue; }

      // No entering others' rooms
      if (eTarget > 6 && t > 6 && !isOwnRoom(c, eTarget)) { continue; }

      const next: PathCost = [...cur, [eTarget, cost + (e[1] ?? 1)]];

      if (!cachedPaths[s][eTarget]) {
        cachedPaths[s][eTarget] = next;
      }
      toCheck.push(next);

      if (eTarget === t) {
        break loop;
      }
    }
  }

  return cachedPaths[s][t];
};

export const parseInput = (input: string, addB = false): string => {
  const lines = split(input);
  if (addB) {
    lines.splice(3, 0, PART_B_ADDITIONS);
  }

  const transformed = lines.join('\n');

  const stripped = transformed.replace(/(?:#|\n|\s+)/g, '').split('');
  for (let i = MAP_GAPS.length - 1; i >= 0; i -= 1) {
    if (stripped[MAP_GAPS[i]] === '.') {
      stripped.splice(MAP_GAPS[i], 1);
    }
  }

  const initialPositions: DecodedState = [];

  for (let i = 0; i < stripped.length; i += 1) {
    const c = stripped[i];

    if (c in LETTERS) {
      initialPositions.push([i, c as Letter]);
    }
  }

  return encodeState(initialPositions);
};

export const searchStep = (
  cur: StateNode,
  toCheck: FibonacciHeap<number, string>,
  stateNodes: StateNodes,
  isB: boolean,
) => {
  const letters: PositionLetter[] = [];
  const byPosition: Record<number, Letter> = {};
  for (let i = 0; i < cur.value.length; i += 1) {
    const c = cur.value[i];
    if (c in LETTERS) {
      byPosition[i] = c as Letter;
      letters.push([i, c as Letter]);
    }
  }

  let toPush: [string, number][] = [];

  moveLoop:
  for (let i = 0; i < letters.length; i += 1) {
    const l = letters[i];

    if (isHome(l, cur.value, isB)) {
      continue;
    }

    if (isInHallway(l)) {
      // See if we can go home
      const pathHome = findShortestPath(l[0], BASE_LETTER_TARGETS[l[1]] + (isB ? 8 : 0), l[1]);
      let lastEmptyIndex!: number;
      let friendsStartAt;
      for (let j = 1; j < pathHome.length; j += 1) {
        const pathNode = pathHome[j];
        const existing = byPosition[pathNode[0]];
        if (existing) {
          if (existing === l[1]) {
            friendsStartAt = j;
          }
          break;
        } else {
          lastEmptyIndex = j;
        }
      }

      let homePos;

      if (lastEmptyIndex === pathHome.length - 1) {
        homePos = pathHome[pathHome.length - 1];
      // If the rest of the path is all friends, go to the last empty space
      } else if (friendsStartAt) {
        let allFriends = true;
        for (let j = friendsStartAt + 1; j < pathHome.length; j += 1) {
          const pathNode = pathHome[j];
          const existing = byPosition[pathNode[0]];

          if (existing !== l[1]) {
            allFriends = false;
            break;
          }
        }

        if (allFriends) {
          homePos = pathHome[lastEmptyIndex];
        }
      }

      // If we can go home, abort this loop; this is the only allowable move
      if (homePos) {
        const next = updateState(cur.value, l[0], homePos[0]);
        const addedCost = getCost(l[1], homePos[1]);
        toPush = [[next, addedCost]];
        // eslint-disable-next-line no-extra-label
        break moveLoop;
      }
    // See if we can leave the room; find + check paths to all six hallway positions
    } else if (!isStuckInRoom(l[0], cur.value)) {
      for (let t = 0; t <= 6; t += 1) {
        const path = findShortestPath(l[0], t, l[1]);

        if (!path) {
          throw new Error(`No valid path for ${l[1]} from ${l[0]} to ${t}`);
        }

        let blocked = false;
        for (let j = 1; j < path.length; j += 1) {
          const pathNode = path[j];
          const existing = byPosition[pathNode[0]];

          if (existing) {
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          const next = updateState(cur.value, l[0], t);
          const addedCost = getCost(l[1], path[path.length - 1][1]);
          toPush.push([next, addedCost]);
        }
      }
    }
  }

  for (let i = 0; i < toPush.length; i += 1) {
    const str = toPush[i][0];
    const cost = cur.key + toPush[i][1];

    if (stateNodes[str] === undefined) {
      stateNodes[str] = toCheck.insert(cost, str) as StateNode;
    } else if (cost < stateNodes[str].key) {
      toCheck.decreaseKey(stateNodes[str], cost);
    }
  }

  return null;
};

const solve = (input: string, isB = false): number => {
  const initialState = parseInput(input, isB);
  const targetState = parseInput(isB ? TARGET_STATE_B : TARGET_STATE_A);

  const toCheck: FibonacciHeap<number, string> = new FibonacciHeap();

  const nodesByState: StateNodes = {};
  nodesByState[initialState] = toCheck.insert(0, initialState) as StateNode;

  const breaker = new CircuitBreaker(100000);
  let solved;
  while (!toCheck.isEmpty()) {
    breaker.tick();

    const cur = toCheck.extractMinimum() as StateNode;

    if (cur.value === targetState) {
      solved = cur;
      break;
    }

    if (cur.key > (isB ? 80000 : 20000)) {
      throw new Error('Cost is too high');
    }

    searchStep(cur, toCheck, nodesByState, isB);
  }

  if (!solved) {
    throw new Error('Could not solve');
  }

  return solved.key;
};

export const a = (input: string): number => solve(input);
export const b = (input: string): number => solve(input, true);
