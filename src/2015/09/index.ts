import { split } from '@lib/processing';
import { FibonacciHeap } from '@tyriar/fibonacci-heap';

type Node = Record<string, number>;
type State = { at: string, cost: number, visited: number };

const indices = [1, 2, 4, 8, 16, 32, 64, 128];

const invertBits = (n: number): number => (n & 255) ^ 255;

/*
  Much faster than:
    Math.sign(solutions[i].cost - cur.cost) === wantSign
*/
const sameSign = (a: number, b: number) => (a ^ b) > 0;

const solve = (input: string, findMax = false): number => {
  let start: string;

  const indicesMap: Record<number | string, string | number> = {};
  let nextIndex = 1;

  const nodes = split(input).reduce((acc, cur) => {
    // Tristram to AlphaCentauri = 34
    const [, a, b, dRaw] = cur.match(/(\w+) to (\w+) = (\d+)/)!;

    if (!acc[a]) {
      const i = nextIndex;
      nextIndex *= 2;

      indicesMap[i] = a;
      indicesMap[a] = i;

      acc[a] = {};
    }
    if (!acc[b]) {
      const i = nextIndex;
      nextIndex *= 2;

      indicesMap[i] = b;
      indicesMap[b] = i;

      acc[b] = {};
    }

    if (!start) { start = a; }

    const d = parseInt(dRaw, 10);

    acc[a][b] = d;
    acc[b][a] = d;

    return acc;
  }, {} as Record<string, Node>);

  const allMask = nextIndex - 1;
  const bitsUsed = allMask.toString(2).length;
  const hasVisitedAll = (visited: number) => (visited & allMask) === allMask;

  const starters: State[] = [];
  Object.keys(nodes).forEach((n) => starters.push({
    at: n, cost: 0, visited: indicesMap[n] as number,
  }));

  const solutions: State[] = [];

  while (starters.length) {
    const curStart = starters.pop()!;

    const toCheck: FibonacciHeap<number, State> = new FibonacciHeap();
    toCheck.insert(0, curStart);

    while (!toCheck.isEmpty()) {
      const cur = toCheck.extractMinimum()!.value!;

      if (hasVisitedAll(cur.visited)) {
        solutions.push(cur);
        break;
      }

      const unvisited = invertBits(cur.visited);

      for (let i = 0; i < bitsUsed; i += 1) {
        const index = indices[i];

        if ((unvisited & index) !== index) { continue; }

        const target = indicesMap[index] as string;

        if (!nodes[cur.at]?.[target]) {
          throw new Error(`Missing edge? ${cur.at} -> ${index}/${target}`);
        }

        const next = {
          at: target,
          cost: cur.cost + nodes[cur.at][target],
          visited: cur.visited | index,
        };

        toCheck.insert(findMax ? -next.cost : next.cost, next);
      }
    }
  }

  if (!solutions.length) {
    throw new Error('Could not solve');
  }

  let cur: State = solutions[0];
  const wantSign = findMax ? 1 : -1;

  for (let i = 1; i < solutions.length; i += 1) {
    if (sameSign(solutions[i].cost - cur.cost, wantSign)) {
      cur = solutions[i];
    }
  }

  return cur.cost;
};

export const part1 = (input: string): number => solve(input);
export const part2 = (input: string): number => solve(input, true);
