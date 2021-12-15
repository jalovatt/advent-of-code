import circuitBreaker from '../../utilities/circuitBreaker';
import { split, splitToNumber } from '../../utilities/processing';

type Coord = [number, number];
type Field = number[][];

class Node {
  pos: Coord;
  value: number;
  edges: Node[];

  constructor(pos: Coord, value: number) {
    this.pos = pos;
    this.value = value;
    this.edges = [];
  }

  connect(other: Node) {
    this.edges.push(other);
    other.edges.push(this);
  }
}

const wrapValue = (n: number) => ((n - 1) % 9) + 1;

const tileField = (field: Field, tiles: number) => {
  const out = new Array(field.length * tiles).fill(null)
    .map(() => new Array(field[0].length * tiles));

  for (let y = 0; y < out.length; y += 1) {
    const fy = y % field.length;
    const ty = Math.trunc(y / field.length);

    for (let x = 0; x < out[0].length; x += 1) {
      const fx = x % field[0].length;
      const tx = Math.trunc(x / field[0].length);

      out[y][x] = wrapValue(field[fy][fx] + ty + tx);
    }
  }

  return out;
};

const buildGraph = (field: Field): [Node, Node] => {
  const graph = new Array(field.length).fill(null).map(() => new Array(field[0].length));

  for (let y = 0; y < field.length; y += 1) {
    for (let x = 0; x < field[0].length; x += 1) {
      let node: Node = graph[y][x];
      if (!node) {
        node = new Node([y, x], field[y][x]);
        graph[y][x] = node;
      }

      let nodeRight = graph[y][x + 1];
      if (!nodeRight && field[y][x + 1] !== undefined) {
        nodeRight = new Node([y, x + 1], field[y][x + 1]);
        graph[y][x + 1] = nodeRight;
      }

      let nodeDown = graph[y + 1]?.[x];
      if (!nodeDown && field[y + 1] !== undefined) {
        nodeDown = new Node([y + 1, x], field[y + 1][x]);
        graph[y + 1][x] = nodeDown;
      }

      if (nodeRight) { node.connect(nodeRight); }
      if (nodeDown) { node.connect(nodeDown); }
    }
  }

  return [graph[0][0], graph[graph.length - 1][graph[0].length - 1]];
};

const printField = (field: (string | number)[][]) => {
  console.log(field.map((row) => row.join('')).join('\n'));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const printPath = (end: Node, prev: Map<Node, Node>, field: number[][]) => {
  const out: (string | number)[][] = field.map((row) => row.map((v) => v));

  let cur: Node | undefined = end;

  while (cur) {
    out[cur.pos[0]][cur.pos[1]] = `\x1b[33m${out[cur.pos[0]][cur.pos[1]]}\x1b[0m`;
    cur = prev.get(cur);
  }

  printField(out);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const printCosts = (end: Node, prev: Map<Node, Node>, cost: Map<Node, number>) => {
  const costs = [];

  let cur: Node | undefined = end;

  while (cur) {
    costs.push(`${cur.value}: ${cost.get(cur)}`);
    cur = prev.get(cur)!;
  }

  costs.reverse();

  console.log(costs.join('\n'));
};

const spliceNext = (toCheck: Node[], cost: Map<Node, number>): Node => {
  let minCost = Number.MAX_SAFE_INTEGER;
  let minIndex = -1;

  for (let i = toCheck.length - 1; i > -1; i -= 1) {
    const cur = toCheck[i];
    const v = cost.get(cur)!;
    if (v < minCost) {
      minCost = v;
      minIndex = i;
    }
  }
  return toCheck.splice(minIndex, 1)[0];
};

/*
  Uniform cost variant of Dijkstra's algorithm; I cobbled this together from
  https://www.geeksforgeeks.org/uniform-cost-search-dijkstra-for-large-graphs/
  and a few other places.
*/
const run = (input: string, tiles = 1) => {
  console.time('building field');
  const field: Field = split(input, '\n').map((row) => splitToNumber(row, ''));
  const [start, end] = buildGraph(tileField(field, tiles));
  console.timeEnd('building field');

  console.time('searching');

  const cost: Map<Node, number> = new Map();
  const prev: Map<Node, Node> = new Map();
  cost.set(start, 0);

  const toCheck: Node[] = [start];

  while (toCheck.length) {
    const cur = spliceNext(toCheck, cost);
    const curCost = cost.get(cur)!;

    for (let i = 0; i < cur.edges.length; i += 1) {
      const neighbour = cur.edges[i];
      const neighbourCost = cost.get(neighbour) ?? Number.MAX_SAFE_INTEGER;

      if (neighbour !== end && cost.get(neighbour) === undefined) {
        toCheck.push(neighbour);
      }

      if (curCost + neighbour.value < neighbourCost) {
        cost.set(neighbour, curCost + neighbour.value);
        prev.set(neighbour, cur);
      }
    }

    circuitBreaker(1000000);
  }

  console.timeEnd('searching');

  const finalCost = cost.get(end)!;

  if (!finalCost) {
    throw new Error('Never reached the end');
  }

  // console.log({ finalCost, startCost: cost.get(start) });

  // printPath(end, prev, field);
  // printCosts(end, prev, cost);

  return finalCost;
};

export const a = (input: string) => run(input);
export const b = (input: string) => run(input, 5);
