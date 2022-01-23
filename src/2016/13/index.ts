import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

interface Node extends INode<number, string> { value: string }
enum Cell { Wall = 'wall', Empty = 'empty' }

const NEIGHBOURS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const splitKey = (k: string): [number, number] => {
  const comma = k.indexOf(',');

  const x = k.slice(0, comma);
  const y = k.slice(comma + 1);

  return [parseInt(x, 10), parseInt(y, 10)];
};

const countBinaryOnes = (n: number): number => {
  let cur = n;
  let count = 0;

  while (cur) {
    if (cur & 1) { count += 1; }
    cur >>>= 1;
  }

  return count;
};

const getMazeCell = (x: number, y: number, c: number): Cell => {
  const z = (x * (x + 3)) + 2 * x * y + y + (y * y) + c;
  const ones = countBinaryOnes(z);

  return (ones & 1) ? Cell.Wall : Cell.Empty;
};

export const solve = (input: string, target?: [number, number]): number => {
  const C = parseInt(input, 10);

  const maze: Record<string, Cell> = { '1,1': Cell.Empty };
  const visited: Map<string, number> = new Map();
  visited.set('1,1', 0);

  const toCheck: FibonacciHeap<number, string> = new FibonacciHeap();
  toCheck.insert(0, '1,1');

  while (!toCheck.isEmpty()) {
    const cur = toCheck.extractMinimum()! as Node;
    const pos = splitKey(cur.value);

    for (let i = 0; i < NEIGHBOURS.length; i += 1) {
      const nx = pos[0] + NEIGHBOURS[i][0];
      const ny = pos[1] + NEIGHBOURS[i][1];

      if (nx < 0 || ny < 0) { continue; }

      if (target && (nx === target[0] && ny === target[1])) {
        return cur.key + 1;
      }

      const nk = `${nx},${ny}`;

      if (visited.has(nk)) { continue; }

      if (!maze[nk]) {
        maze[nk] = getMazeCell(nx, ny, C);
      }

      if (maze[nk] === Cell.Wall) { continue; }

      visited.set(nk, cur.key + 1);
      toCheck.insert(cur.key + 1, nk);
    }
  }

  if (target) {
    throw new Error('Never reached target');
  }

  return Array.from(visited).filter((v) => v[1] <= 50).length;
};
