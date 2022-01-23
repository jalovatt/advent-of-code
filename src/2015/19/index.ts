import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

// Just specifying that value IS defined
export interface SeenNode extends INode<number, string> { value: string }
export type SeenNodes = Record<string, SeenNode>;

const parseInput = (input: string): [Record<string, string[]>, string, Record<string, string>] => {
  const [rawReplacements, rawBase] = split(input, '\n\n');

  const replacements: Record<string, string[]> = {};

  const singleLetters = new Array(52).fill(null);
  for (let i = 0; i < 26; i += 1) {
    singleLetters[i] = String.fromCharCode(i + 97);
    singleLetters[i + 26] = String.fromCharCode(i + 26 + 97);
  }

  const singleMap: Record<string, string> = {};

  split(rawReplacements).forEach((line) => {
    const [, a, b] = line.match(/(\w+) => (\w+)/)!;

    if (!singleMap[a]) { singleMap[a] = singleLetters.shift(); }
    if (!replacements[singleMap[a]]) { replacements[singleMap[a]] = []; }

    const currentReplacements: string[] = [];

    b.match(/[A-Z][a-z]?/g)!.forEach((chars) => {
      if (!singleMap[chars]) { singleMap[chars] = singleLetters.shift(); }

      currentReplacements.push(singleMap[chars]);
    });

    replacements[singleMap[a]].push(currentReplacements.join(''));
  });

  const base: string[] = [];
  rawBase.match(/([A-Z][a-z]?)/g)!.forEach((chars) => {
    base.push(singleMap[chars] || chars);
  });

  return [replacements, base.join(''), singleMap];
};

export const part1 = (input: string): number => {
  const [replacements, base] = parseInput(input);

  const possible: Set<string> = new Set();

  for (let i = 0; i < base.length; i += 1) {
    const atom = base[i];

    if (!replacements[atom]) {
      continue;
    }

    for (let j = 0; j < replacements[atom].length; j += 1) {
      const pre = base.slice(0, i);
      const post = base.slice(i + 1);

      possible.add(`${pre}${replacements[atom][j]}${post}`);
    }
  }

  return possible.size;
};

/*
  {
    1: [['a', 'b'], ['b', 'c']],
    2: [['ab', 'b'], ['bc', 'c']],
    3: [['abc', 'b'], ['bcd', 'c']],
    max: 3
  }
*/
type Reductions = { max: number, [key: number]: [string, string][] };
const getReductions = (replacements: Record<string, string[]>): Reductions => {
  const out: Reductions = { max: 0 };

  Object.keys(replacements).forEach((k) => {
    for (let i = 0; i < replacements[k].length; i += 1) {
      const r = replacements[k][i];

      if (!out[r.length]) { out[r.length] = []; }
      out[r.length].push([r, k]);
      out.max = Math.max(out.max, r.length);
    }
  });

  return out;
};

const PART2_TARGET = 'e';

/*
  Got a lot of help from Reddit here.

  The trick is prioritizing our queue by the shortest string, rather than the
  cheapest; there are too many possibilities for cheapest-first to reduce the
  entire thing in a reasonable time, even with a "replace the longest
  segments first" approach.
*/
export const part2 = (input: string): number => {
  const [replacements, start, singleMap] = parseInput(input);
  const reductions = getReductions(replacements);

  const target = singleMap[PART2_TARGET];

  const toCheck: FibonacciHeap<number, string> = new FibonacciHeap();
  const costs: Record<string, number> = { [start]: 0 };
  const seen: SeenNodes = {};
  seen[start] = toCheck.insert(0, start) as SeenNode;

  const breaker = new CircuitBreaker(100000);

  while (!toCheck.isEmpty()) {
    breaker.tick();

    const cur = toCheck.extractMinimum() as SeenNode;
    const str = cur.value;

    // Our biggest priority is reducing the size of the string we're dealing with.
    // Try the biggest changes first.
    for (let l = reductions.max; l >= 1; l -= 1) {
      if (!reductions[l]) { continue; }

      let reduced = false;

      for (let r = 0; r < reductions[l].length; r += 1) {
        const next = str.replace(reductions[l][r][0], reductions[l][r][1]);

        if (next === str) { continue; }

        reduced = true;

        const cost = costs[cur.value] + 1;

        if (next === target) {
          return cost;
        }

        if (seen[next] === undefined) {
          costs[next] = cost;
          seen[next] = toCheck.insert(next.length, next) as SeenNode;
          reduced = true;
        } else if (cost < seen[next].key) {
          toCheck.decreaseKey(seen[next], cost);
        }
      }

      /*
        If we replaced something at this length, save some time by skipping the
        smaller lengths and moving on to the next string in the queue. Not sure
        if this is guaranteed to work, but it works here.
      */
      if (reduced) { break; }
    }
  }

  throw new Error('Could not solve');
};
