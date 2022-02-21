import CircuitBreaker from '@lib/CircuitBreaker';
import { log } from '@lib/logging';
import { split } from '@lib/processing';
import { FibonacciHeap } from '@tyriar/fibonacci-heap';

// y, x
type Pos = [number, number];
type FieldNode = { pos: Pos, neighbours: FieldNode[], unit: Unit | null };
type FieldNodes = (FieldNode | null)[][];

enum UnitType { E, G }
type Unit = { type: UnitType, hp: number, ap: number, node: FieldNode };

const GAME_OVER = Symbol('no enemies');

const HIT_POINTS = 200;
const ATTACK_POWER = 3;

const manhattan = (a: FieldNode, b: FieldNode): number => (
  Math.abs(a.pos[0] - b.pos[0]) + Math.abs(a.pos[1] - b.pos[1])
);

const getUnitDescriptor = (u: Unit, includeHealth = false): string => (
  `${UnitType[u.type]} @ ${u.node.pos[0]},${u.node.pos[1]}${includeHealth ? ` (${u.hp})` : ''}`
);

const compareTBLR = (a: FieldNode, b: FieldNode): FieldNode => {
  if (a.pos[0] < b.pos[0]) { return a; }
  if (b.pos[0] < a.pos[0]) { return b; }

  if (a.pos[1] < b.pos[1]) { return a; }
  return b;
};

export const sortTBLR = (arr: Unit[] | FieldNode[]) => {
  if ('hp' in arr[0]) {
    (arr as Unit[]).sort((a, b) => (
      (a.node.pos[0] - b.node.pos[0]) || (a.node.pos[1] - b.node.pos[1])
    ));
  } else {
    (arr as FieldNode[]).sort((a, b) => (a.pos[0] - b.pos[0]) || (a.pos[1] - b.pos[1]));
  }
};

const sortDistanceTBLR = (arr: FieldNode[], from: FieldNode) => arr.sort((a, b) => (
  manhattan(from, a) - manhattan(from, b)
  || (a.pos[0] - b.pos[0])
  || (a.pos[1] - b.pos[1])
));

const sortHealthTBLR = (arr: Unit[]) => arr.sort((a, b) => (
  a.hp - b.hp
  || (a.node.pos[0] - b.node.pos[0])
  || (a.node.pos[1] - b.node.pos[1])
));

const join = (a: FieldNode, b: FieldNode) => {
  a.neighbours.push(b);
  b.neighbours.push(a);
};

const move = (unit: Unit, node: FieldNode) => {
  unit.node.unit = null;
  unit.node = node;
  node.unit = unit;
};

const attack = (u: Unit, t: Unit) => {
  t.hp -= u.ap;

  if (t.hp < 0) {
    t.hp = 0;
    t.node.unit = null;
  }
};

const parseInput = (input: string, elvesAp = ATTACK_POWER): [Unit[], FieldNodes, Pos] => {
  const field: FieldNodes = [];
  const units: Unit[] = [];

  const rows = split(input);

  rows.forEach((row, y) => {
    field.push([]);

    split(row, '').forEach((char, x) => {
      if (char === '#') {
        field[y][x] = null;
        return;
      }

      const node: FieldNode = { pos: [y, x] as Pos, neighbours: [], unit: null };
      field[y][x] = node;

      if (field[y - 1]?.[x]) {
        join(node, field[y - 1][x]!);
      }

      if (field[y]?.[x - 1]) {
        join(node, field[y][x - 1]!);
      }

      if (char in UnitType) {
        const type = UnitType[char as keyof typeof UnitType];

        const u = {
          type,
          hp: HIT_POINTS,
          ap: type === UnitType.E ? elvesAp : ATTACK_POWER,
          node,
        };
        units.push(u);
        node.unit = u;
      }
    });
  });

  // Pre-sorting all the neighbours so we don't have to do it a bunch later
  field.flat().forEach((n) => {
    if (n) {
      sortTBLR(n.neighbours);
    }
  });

  return [units, field, [rows.length, rows[0].split('').length]];
};

const getShortestPathStep = (u: Unit, t: FieldNode): [FieldNode, number] | null => {
  const toCheck: FibonacciHeap<number, FieldNode> = new FibonacciHeap();
  toCheck.insert(0, t);

  const seen: Set<FieldNode> = new Set();
  seen.add(t);

  let shortestStep: FieldNode | null = null;
  let shortestCost = Number.MAX_SAFE_INTEGER;

  while (!toCheck.isEmpty()) {
    const cur = toCheck.extractMinimum()!;

    // We've exhausted all shortest paths
    if (cur.key > shortestCost) {
      break;
    }

    const neighbours = cur.value!.neighbours;

    for (let i = 0; i < neighbours.length; i += 1) {
      const n = neighbours[i];
      if (n === u.node) {
        if (!shortestStep) {
          shortestCost = cur.key;
          shortestStep = cur.value!;
        } else if (cur.key === shortestCost) {
          shortestStep = compareTBLR(shortestStep, cur.value!);
        }

        continue;
      }

      if (n.unit) {
        continue;
      }

      if (!seen.has(n)) {
        toCheck.insert(cur.key + 1, n);
        seen.add(n);
      }
    }
  }

  return shortestStep ? [shortestStep, shortestCost] : null;
};

export const getMoveTarget = (
  u: Unit,
  units: Unit[],
): FieldNode | typeof GAME_OVER | null => {
  // Next to an enemy
  if (u.node.neighbours.find((n) => n.unit && n.unit.type !== u.type)) {
    return null;
  }

  const targets = units.filter((t) => t !== u && t.hp && t.type !== u.type);

  if (!targets.length) {
    return GAME_OVER;
  }

  const targetAdjacent: FieldNode[] = [];
  for (let i = 0; i < targets.length; i += 1) {
    const tn = targets[i].node.neighbours;

    for (let j = 0; j < tn.length; j += 1) {
      if (!tn[j].unit) {
        targetAdjacent.push(tn[j]);
      }
    }
  }

  sortDistanceTBLR(targetAdjacent, u.node);

  let bestStep: FieldNode | null = null;
  let bestCost = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < targetAdjacent.length; i += 1) {
    // The best case for this node is longer than our shortest path
    if (manhattan(u.node, targetAdjacent[i]) > bestCost) {
      break;
    }

    const shortestPathStep = getShortestPathStep(u, targetAdjacent[i]);

    if (shortestPathStep) {
      if (!bestStep || shortestPathStep[1] < bestCost) {
        bestStep = shortestPathStep[0];
        bestCost = shortestPathStep[1];
      } else if (shortestPathStep[1] === bestCost) {
        bestStep = compareTBLR(bestStep, shortestPathStep[0]);
      }
    }
  }

  return bestStep;
};

const getCombatTarget = (u: Unit): Unit | null => {
  const targets = u.node.neighbours.reduce((acc, cur) => {
    if (cur.unit && cur.unit.type !== u.type) {
      acc.push(cur.unit);
    }

    return acc;
  }, [] as Unit[]);

  sortHealthTBLR(targets);

  return targets[0] ?? null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (units: Unit[], field: FieldNodes) => {
  const out: string[][] = field.map((row) => row.map((n) => (
    n ? '.' : '#'
  )));

  const unitsByRow: Unit[][] = [];

  units.forEach((u) => {
    out[u.node.pos[0]][u.node.pos[1]] = (u.type === UnitType.E)
      ? (u.hp ? 'E' : 'e')
      : (u.hp ? 'G' : 'g');

    if (!u.hp) { return; }

    const y = u.node.pos[0];

    if (!unitsByRow[y]) {
      unitsByRow[y] = [];
    }

    unitsByRow[y].push(u);
  });

  log(out.map((row, y) => {
    const unitStr = unitsByRow[y]
      ? unitsByRow[y]
        .sort((a, b) => a.node.pos[1] - b.node.pos[1])
        .map((u) => getUnitDescriptor(u, true).padEnd(15, ' ')).join('  ')
      : '';

    return `${row.join('')}   ${unitStr}`;
  }).join('\n'));
};

export const turn = (units: Unit[]): typeof GAME_OVER | null => {
  sortTBLR(units);

  for (let i = 0; i < units.length; i += 1) {
    const u = units[i];
    if (!u.hp) { continue; }

    const m = getMoveTarget(u, units);

    if (m === GAME_OVER) {
      return GAME_OVER;
    }

    if (m) {
      move(u, m);
    }

    const t = getCombatTarget(u);

    if (t) {
      attack(u, t);
    }
  }

  return null;
};

const computeScore = (units: Unit[], t: number): number => t * (
  units.reduce((acc, cur) => acc + cur.hp, 0)
);

const run = (input: string, elvesAp: number): [Unit[], number] => {
  const [units] = parseInput(input, elvesAp);

  let t = 0;
  const breaker = new CircuitBreaker(200);
  while (!breaker.hasTripped) {
    breaker.tick();

    if (turn(units) === GAME_OVER) {
      break;
    }

    t += 1;
  }

  return [units, t];
};

export const part1 = (input: string): number => {
  const [units, t] = run(input, ATTACK_POWER);

  return computeScore(units, t);
};

export const part2 = (input: string): number => {
  /*
    For all APs from 50-66, it will take 4 hits (Math.ceil(200 / ap)) to kill a
    target. This means that if any of 51-66 are solutions, 50 will be as well.

    By taking the lowest value where the number of hits changes, we can reduce
    the list from 196 items to 23.

    From there we can binary search, note all winning APs, and then return the
    score of the lowest one.

    https://www.reddit.com/r/adventofcode/comments/a6nw3b/comment/ebxkt28/?utm_source=share&utm_medium=web2x&context=3
  */

  const powersToCheck: number[] = [4];
  let cur = 4;
  while (cur < HIT_POINTS) {
    const curHits = Math.ceil(HIT_POINTS / cur);
    const nextHits = Math.ceil(HIT_POINTS / powersToCheck[powersToCheck.length - 1]);

    if (curHits !== nextHits) {
      powersToCheck.push(cur);
    }

    cur += 1;
  }

  const elvesCount = parseInput(input)[0].filter((u) => u.type === UnitType.E).length;

  let minIndex = 0;
  let maxIndex = powersToCheck.length - 1;

  let curIndex = (powersToCheck.length / 2) >> 0;

  const scores: Map<number, number> = new Map();

  const breaker = new CircuitBreaker(powersToCheck.length);
  while (minIndex <= maxIndex) {
    breaker.tick();

    curIndex = ((minIndex + maxIndex) / 2) >> 0;

    const [units, t] = run(input, powersToCheck[curIndex]);

    const elvesLeft = units.filter((u) => u.type === UnitType.E && u.hp).length;
    if (elvesLeft === elvesCount) {
      scores.set(curIndex, computeScore(units, t));
      maxIndex = curIndex - 1;
    } else {
      minIndex = curIndex + 1;
    }
  }

  return Array.from(scores.entries()).sort((a, b) => a[0] - b[0])[0][1];
};
