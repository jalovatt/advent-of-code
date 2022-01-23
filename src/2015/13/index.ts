import CircuitBreaker from '@lib/CircuitBreaker';
import { inspect } from '@lib/logging';
import { split } from '@lib/processing';

type Node = { name: string, index: number, edges: Record<string, number> };
type Nodes = Record<string, Node>;

type State = { at: string, visited: number, happiness: number };

const parseInput = (input: string, addSelf = false): [string[], Nodes, number] => {
  const nodes: Nodes = {};
  const names: string[] = [];
  let nextIndex = 1;

  split(input).forEach((line) => {
    // Alice would gain 54 happiness units by sitting next to Bob.
    const [, a, sign, n, b] = line.match(/(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)./)!;

    if (!nodes[a]) {
      nodes[a] = {
        name: a,
        index: nextIndex,
        edges: {},
      };

      nextIndex *= 2;
      names.push(a);
    }
    if (!nodes[b]) {
      nodes[b] = {
        name: b,
        index: nextIndex,
        edges: {},
      };

      nextIndex *= 2;
      names.push(b);
    }

    const v = (sign === 'gain' ? 1 : -1) * parseInt(n, 10);

    if (Number.isNaN(v)) {
      throw new Error(`Error parsing line: ${inspect({ line, a, sign, n, b })}`);
    }

    nodes[a].edges[b] = (nodes[a].edges[b] || 0) + v;
    nodes[b].edges[a] = (nodes[b].edges[a] || 0) + v;
  });

  if (addSelf) {
    nodes.Me = { name: 'Me', index: nextIndex, edges: {} };
    nextIndex *= 2;

    for (let i = 0; i < names.length; i += 1) {
      nodes.Me.edges[names[i]] = 0;
      nodes[names[i]].edges.Me = 0;
    }

    names.push('Me');
  }

  return [names, nodes, nextIndex - 1];
};

/*
  TODO: Improve perf by using indices for everything. Remove names entirely, keep
  a couple of global records for At and Happiness, and only have to push a number
  into toCheck for each new state.
*/
const solve = (input: string, addSelf = false): number => {
  const [names, nodes, ALL_VISITED_MASK] = parseInput(input, addSelf);
  const breaker = new CircuitBreaker(200000);

  const solutions: State[] = [];

  const toCheck: State[] = [{ at: 'Alice', visited: nodes.Alice.index, happiness: 0 }];
  while (toCheck.length) {
    breaker.tick();

    const cur = toCheck.pop()!;

    for (let i = 0; i < names.length; i += 1) {
      const name = names[i];

      if ((cur.visited & nodes[name].index) === 0) {
        const next: State = {
          at: name,
          visited: cur.visited | nodes[name].index,
          happiness: cur.happiness + nodes[cur.at].edges[name],
        };

        if (next.visited === ALL_VISITED_MASK) {
          solutions.push({ ...next, happiness: next.happiness + nodes[name].edges.Alice });
        } else {
          toCheck.push(next);
        }
      }
    }
  }

  if (!solutions) {
    throw new Error('Could not solve');
  }

  return solutions.sort((a, b) => b.happiness - a.happiness)[0].happiness;
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, true);
