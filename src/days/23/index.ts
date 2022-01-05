import circuitBreaker from '../../utilities/circuitBreaker';
import { counter, dir, inspect, log } from '../../utilities/logging';
import { split } from '../../utilities/processing';

type Letter = 'A' | 'B' | 'C' | 'D';
type PositionLetter = [number, Letter];
type State = PositionLetter[];

const LETTERS = { A: true, B: true, C: true, D: true };

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

type Node = [number, number?][];
const graph: Record<number, Node> = {
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

const BASE_LETTER_TARGETS = { A: 11, B: 12, C: 13, D: 14 };
const HOME_MODS = { A: 0, B: 1, C: 2, D: 3 };
const isOwnRoom = (c: Letter, p: number) => (p - 7) % 4 === HOME_MODS[c];

const LETTER_COSTS = { A: 1, B: 10, C: 100, D: 1000 };
const getCost = (letter: Letter, baseCost: number): number => baseCost * LETTER_COSTS[letter];

// [pos, cumulative cost][]
type PathCost = [number, number][];

/*
  {
    [from]: {
      [to]: [[a, cost a], [b, cost a + b], ...]
    }
  }
*/
const cachedPaths: Record<number, Record<number, PathCost>> = {};
const findShortestPath = (s: number, t: number, c: Letter): PathCost => {
  // log(`finding shortest path from ${s} to ${t}`);
  if (cachedPaths[s]?.[t]) {
    // log(`  got ${cachedPaths[s][t].map((step) => step[0]).join(' -> ')} (cached)`);
    return cachedPaths[s][t];
  }

  if (!cachedPaths[s]) { cachedPaths[s] = {}; }
  const toCheck: [number, number][][] = [[[s, 0]]];

  loop:
  while (toCheck.length) {
    // TODO: Check sort direction
    const cur = toCheck.sort((l, r) => r[r.length - 1][1] - l[l.length - 1][1]).pop()!;
    // log(`cur: ${inspect(cur)}`);
    const pos = cur[cur.length - 1][0];
    const cost = cur[cur.length - 1][1];

    const edges = graph[pos];

    // log(`  edges: ${inspect(edges)}`);

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

      // log(`  cur: ${inspect(cur)}\n  nxt: ${inspect(next)}`);

      if (!cachedPaths[s][eTarget]) {
        cachedPaths[s][eTarget] = next;
      }
      toCheck.push(next);

      if (eTarget === t) {
        break loop;
      }
    }
  }

  // log(`  got ${cachedPaths[s][t].map((step) => step[0]).join(' -> ')}`);

  return cachedPaths[s][t];
};

const FIRST_LETTER_START = 7;

const A_TARGET_ROW = 11;
const B_TARGET_ROW = 19;

export const encodeState = (state: State) => {
  const arr = new Array(23).fill('.');

  for (let i = 0; i < state.length; i += 1) {
    arr[state[i][0]] = state[i][1];
  }

  return arr.join('');
};

const decodeState = (state: string): State => {
  const out: PositionLetter[] = [];

  for (let i = 0; i < state.length; i += 1) {
    const c = state[i];
    if (c in LETTERS) {
      out.push([i, c as Letter]);
    }
  }

  return out;
};

const updateState = (state: State, from: PositionLetter, to: PositionLetter): State => {
  const out = state.slice();

  const i = state.indexOf(from);
  out[i] = to;

  return out;
};

const isInHallway = (l: PositionLetter): boolean => l[0] < 7;

const isHome = (l: PositionLetter, state: State, stringState: string, isB = false): boolean => {
  const p = l[0];
  const c = l[1];
  if (!isOwnRoom(c, p)) { return false; }

  if (p >= (isB ? B_TARGET_ROW : A_TARGET_ROW)) { return true; }
  if (stringState[p + 4] === c) { return true; }

  return false;
};

const isStuckInRoom = (p: number, cur: string): boolean => {
  if (p < 11) { return false; }
  return cur[p - 4] !== '.';
};

type StateCosts = Record<string, number>;
type StateTree = Record<string, string[]>;

/*
  ##############...........####B#C#B#D####A#D#C#A##########
  .. . . . ..BCBDADCA
*/
const graphGaps = [2, 4, 6, 8];
export const parseInput = (input: string, addB = false): [string, StateCosts, StateTree] => {
  const lines = split(input);
  if (addB) {
    lines.splice(3, 0, PART_B_ADDITIONS);
  }

  const transformed = lines.join('\n');

  if (addB) {
    dir({ input, transformed });
  }
  const stripped = transformed.replace(/(?:#|\n|\s+)/g, '').split('');
  for (let i = graphGaps.length - 1; i >= 0; i -= 1) {
    if (stripped[graphGaps[i]] === '.') {
      stripped.splice(graphGaps[i], 1);
    }
  }

  const initialPositions: State = [];

  // let currentLetterPos = FIRST_LETTER_START;
  for (let i = 0; i < stripped.length; i += 1) {
    const c = stripped[i];

    if (c in LETTERS) {
      initialPositions.push([i, c as Letter]);
      // currentLetterPos += 1;
    }
  }

  const stateCosts: StateCosts= {};
  const initialState = encodeState(initialPositions);
  stateCosts[initialState] = 0;

  const stateTree: StateTree = {};
  return [initialState, stateCosts, stateTree];
};

export const searchStep = (
  cur: string,
  toCheck: string[],
  stateCosts: StateCosts,
  stateTree: StateTree,
  isB: boolean,
) => {
  stateTree[cur] = [];
  // log(`\n\n${cur} @ cost ${stateCosts[cur]}`);
  const state = decodeState(cur);

  // log(`${cur} = $${stateCosts[cur]}, (${toCheck.length} to check)`);
  // print(cur);

  const byPosition = state.reduce((acc, v) => {
    acc[v[0]] = v[1];
    return acc;
  }, {} as Record<number, string>);

  // dir({ byPosition});

  let toPush: [State, number][] = [];

  moveLoop:
  for (let i = 0; i < state.length; i += 1) {
    const l = state[i];

    if (isHome(l, state, cur, isB)) {
      continue;
    }

    if (isInHallway(l)) {
      // log(`${l[1]} @ ${l[0]} is in the hallway`);
      // See if we can go home
      const pathHome = findShortestPath(l[0], BASE_LETTER_TARGETS[l[1]] + (isB ? 8 : 0), l[1]);
      // log(` path home for ${l[1]} @ ${l[0]}: ${pathHome.map((p) => p[0]).join(' -> ')}`);
      let lastEmptyIndex!: number;
      let friendsStartAt;
      for (let j = 1; j < pathHome.length; j += 1) {
        const pathNode = pathHome[j];
        const existing = byPosition[pathNode[0]];
        // log(`  @ ${pathNode[0]}, existing? ${existing}`);
        if (existing) {
          if (existing === l[1]) {
            friendsStartAt = j;
          } else {
            // log(`  blocked by ${existing} @ ${pathNode[0]}`);
          }
          break;
        } else {
          lastEmptyIndex = j;
        }
      }

      let homePos;

      if (lastEmptyIndex === pathHome.length - 1) {
        homePos = pathHome[pathHome.length - 1];
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
          // log(`  home is full of friends, going to ${pathHome[lastEmptyIndex]}`);
          homePos = pathHome[lastEmptyIndex];
        }
      }

      // If we can, abort this loop; this is the only move to make from this state
      if (homePos) {
        // log(`  not blocked`);
        const next = updateState(state, l, [homePos[0], l[1]]);
        // const encoded = encodeState(next);

        // if (!stateCosts[encoded]) {
        const addedCost = getCost(l[1], homePos[1]);
        // stateCosts[encoded] = stateCosts[cur] + addedCost;
        // log(`\n  adding ${encodeState(next)}\n  ${l[1]} from ${l[0]} -> ${homePos[0]} (hall -> home)\n    addedCost ${addedCost} = ${stateCosts[cur] + addedCost}\n    ${inspect(pathHome)}`);
        // toPush.push([next, addedCost]);
        toPush = [[next, addedCost]];
        // log(`  * move to home is the only allowable move *`);
        // eslint-disable-next-line no-extra-label
        break moveLoop;
        // }
      }
    } else if (isStuckInRoom(l[0], cur)) {
      // log(`${l[1]} @ ${l[0]} is stuck in room`);
    // See if we can leave the room; find + check paths to all six hallway positions
    } else if (!isStuckInRoom(l[0], cur)) {
      // log(`${l[1]} @ ${l[0]} is in room, can move`);
      for (let t = 0; t <= 6; t += 1) {
        // log(`  finding path to ${t}`);
        const path = findShortestPath(l[0], t, l[1]);

        if (!path) {
          throw new Error(`No valid path for ${l[1]} from ${l[0]} to ${t}`);
        }

        // log(` path for ${l[1]} @ ${l[0]} to ${t}: ${path.map((p) => p[0]).join(' -> ')}`);

        let blocked = false;
        for (let j = 1; j < path.length; j += 1) {
          const pathNode = path[j];
          // log(`    ${pathNode}`);
          const existing = byPosition[pathNode[0]];

          if (existing) {
            // log(`  blocked by ${existing} @ ${pathNode[0]}`);
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          const next = updateState(state, l, [t, l[1]]);
          const addedCost = getCost(l[1], path[path.length - 1][1]);
          // log(`\n  adding ${encodeState(next)}\n  ${l[1]} from ${l[0]} -> ${t} (room -> hall)\n    addedCost ${addedCost} = ${stateCosts[cur] + addedCost}\n    ${inspect(path)}`);
          toPush.push([next, addedCost]);
        }
      }
    }
  }

  // log(`  ${toPush.length} to push into queue`);
  for (let i = 0; i < toPush.length; i += 1) {
    const str = encodeState(toPush[i][0]);

    // log(`pushing ${str}`);
    if (stateCosts[str] === undefined) {
      toCheck.push(str);
    }

    const cost = stateCosts[cur] + toPush[i][1];
    // log(`  pushing ${str}: ${stateCosts[cur]} + ${toPush[i][1]} = ${cost}`);
    stateCosts[str] = Math.min(cost, stateCosts[str] || Number.MAX_SAFE_INTEGER);
    stateTree[cur].push(str);
  }

  return null;
};

const getSolutionSteps = (stateCosts: StateCosts, stateTree: StateTree, initialState: string, targetState: string): string[] => {
  const treeEntries = Object.entries(stateTree);
  const out = [];

  let cur = targetState;

  while (cur) {
    out.unshift(cur);

    const possible = treeEntries.reduce((acc, next) => {
      if (next[1].includes(cur)) {
        acc.push(next[0]);
      }
      return acc;
    }, [] as string[]);

    possible.sort((l, r) => stateCosts[l] - stateCosts[r]);

    cur = possible[0];
  }

  return out;
};

const solve = (input: string, isB = false): number => {
  const [initialState, stateCosts, stateTree] = parseInput(input, isB);

  const [targetState] = parseInput(isB ? TARGET_STATE_B : TARGET_STATE_A);

  // dir(initialState);

  print(initialState, isB);

  let solvedState;
  const toCheck = [initialState];
  while (toCheck.length) {
    // log('\n');
    // counter('iter', true);
    circuitBreaker(150000, () => {
      const costs = Object.entries(stateCosts);
      costs.sort((l, r) => l[1] - r[1]);
      log(`circuit breaker tripped:\n#stateCosts = ${costs.length}\n max cost = ${costs[costs.length - 1]}\nnext cost = ${costs[0]}`);
    });

    // TODO: Priority queue, check sort order
    toCheck.sort((l, r) => stateCosts[r] - stateCosts[l]);
    // dir(toCheck.slice(-4).map((s) => `${s} -> $${stateCosts[s]}`));
    const cur = toCheck.pop()!;

    if (cur === targetState) {
      solvedState = cur;
      break;
    }

    if (stateCosts[cur] > (isB ? 80000 : 15000)) {
      throw new Error('Cost is too high');
    }

    searchStep(cur, toCheck, stateCosts, stateTree, isB);
  }

  if (!solvedState) {
    throw new Error('Could not solve');
  }

  // const solutionSteps = getSolutionSteps(stateCosts, stateTree, initialState, targetState);
  // dir({ solvedState, solutionSteps });

  return stateCosts[solvedState];
};

export const a = (input: string): number => solve(input);

export const b = (input: string): number => solve(input, true);
