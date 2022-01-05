/* eslint-disable no-labels */
import circuitBreaker from '@lib/circuitBreaker';
import { log } from '@lib/logging';
import { split, splitToNumber } from '@lib/processing';
import { BucketQueue } from './BucketQueue';

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

const tileField = (field: number[][], tiles: number) => {
  const width = field.length * tiles;
  const height = field[0].length * tiles;
  const out = new Array(width);

  for (let y = 0; y < out.length; y += 1) {
    const fy = y % field.length;
    const ty = Math.trunc(y / field.length);

    out[y] = new Array(height);

    for (let x = 0; x < out[0].length; x += 1) {
      const fx = x % field[0].length;
      const tx = Math.trunc(x / field[0].length);

      out[y][x] = wrapValue(field[fy][fx] + ty + tx);
    }
  }

  return out;
};

const buildGraph = (field: (Node | number)[][]): [Node, Node] => {
  // const graph = new Array(field.length).fill(null).map(() => new Array(field[0].length));

  for (let y = 0; y < field.length; y += 1) {
    for (let x = 0; x < field[0].length; x += 1) {
      let v: Node | number = field[y][x];
      if (typeof v === 'number') {
        v = new Node([y, x], v);
        // eslint-disable-next-line no-param-reassign
        field[y][x] = v;
      }

      let vRight = field[y][x + 1];
      if (typeof vRight === 'number') {
        vRight = new Node([y, x + 1], vRight);
        // eslint-disable-next-line no-param-reassign
        field[y][x + 1] = vRight;
      }

      let vDown = field[y + 1]?.[x];
      if (typeof vDown === 'number') {
        vDown = new Node([y + 1, x], vDown);
        // eslint-disable-next-line no-param-reassign
        field[y + 1][x] = vDown;
      }

      if (vRight) { v.connect(vRight); }
      if (vDown) { v.connect(vDown); }
    }
  }

  return [field[0][0] as Node, field[field.length - 1][field[0].length - 1] as Node];
};

const printField = (field: (string | number)[][]) => {
  log(field.map((row) => row.join('')).join('\n'));
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

  log(costs.join('\n'));
};

/*
  Uniform cost variant of Dijkstra's algorithm; I cobbled this together from
  https://www.geeksforgeeks.org/uniform-cost-search-dijkstra-for-large-graphs/
  and a few other places.
*/
const run = (input: string, tiles = 1) => {
  // log();
  // time('initial field');
  const field: Field = split(input, '\n').map((row) => splitToNumber(row, ''));
  // time('initial field', true);

  // time('tiledField');
  const tiledField = tileField(field, tiles);
  // time('tiledField', true);

  // time('buildGraph');
  const [start, end] = buildGraph(tiledField);
  // time('buildGraph', true);

  // time('searching');
  const cost: Map<Node, number> = new Map();
  const visited: Set<Node> = new Set();
  const prev: Map<Node, Node> = new Map();
  visited.add(start);
  cost.set(start, 0);

  const toCheck: BucketQueue<Node> = new BucketQueue(
    9 * tiledField.length * tiledField[0].length,
    (node) => cost.get(node)!,
  );

  toCheck.enqueue(start);

  mainLoop:
  while (toCheck.size) {
    const cur = toCheck.dequeue();
    const curCost = cost.get(cur)!;

    for (let i = 0; i < cur.edges.length; i += 1) {
      const neighbour = cur.edges[i];
      const existingNeighbourCost = cost.get(neighbour) ?? Number.MAX_SAFE_INTEGER;
      const currentNeighbourCost = curCost + neighbour.value;

      if (currentNeighbourCost < existingNeighbourCost) {
        cost.set(neighbour, currentNeighbourCost);
        prev.set(neighbour, cur);
      }

      if (neighbour === end) { break mainLoop; }

      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        toCheck.enqueue(neighbour);
      }
    }

    circuitBreaker(1000000);
  }
  // time('searching', true);

  const finalCost = cost.get(end)!;

  if (!finalCost) {
    throw new Error('Never reached the end');
  }

  // printPath(end, prev, field);
  // printCosts(end, prev, cost);

  return finalCost;
};

export const a = (input: string) => run(input);
export const b = (input: string) => run(input, 5);
