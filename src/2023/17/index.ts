import { split } from '@lib/processing';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

interface WalkerNode extends INode<number, Walker> { value: Walker }

enum Direction {
  N,
  E,
  S,
  W,
}

type Field = number[][];

type Walker = {
  x: number;
  y: number;
  timesInSameDirection: number;
  direction: Direction;
  heatLoss: number;
};

const encodeWalkerState = (w: Walker) => ((((((
  w.timesInSameDirection) << 2) + w.direction) << 8) + w.x) << 8) + w.y;

const move = (w: Walker, turning?: 1 | -1): Walker => {
  const next = { ...w };

  if (turning) {
    next.direction = (next.direction + turning + 4) % 4;
    next.timesInSameDirection = 0;
  }

  next.timesInSameDirection += 1;
  switch (next.direction) {
    case Direction.N: { next.y -= 1; break; }
    case Direction.E: { next.x += 1; break; }
    case Direction.S: { next.y += 1; break; }
    case Direction.W:
    default: { next.x -= 1; break; }
  }

  return next;
};

const manhattanRemaining = (x: number, y: number, field: Field) => {
  const a = field[0].length - 1 - x;
  const b = field.length - 1 - y;

  // Since the bottom-right corner is the target, we don't have to worry about Math.abs here
  return a + b;
};

const solve = (input: string, part2 = false): number => {
  const field: Field = split(input).map((row) => row.split('').map((n) => parseInt(n, 10)));

  const visited: Map<number, number> = new Map([[0, 0]]);

  const heap: FibonacciHeap<number, Walker> = new FibonacciHeap();

  heap.insert(manhattanRemaining(0, 0, field), {
    x: 0,
    y: 0,
    direction: Direction.E,
    timesInSameDirection: 0,
    heatLoss: 0,
  });
  heap.insert(manhattanRemaining(0, 0, field), {
    x: 0,
    y: 0,
    direction: Direction.S,
    timesInSameDirection: 0,
    heatLoss: 0,
  });

  const insert = (w: Walker): number | false => {
    // Stop if we're out of bounds
    if (w.x < 0 || w.x === field[0].length || w.y < 0 || w.y === field.length) {
      return false;
    }

    w.heatLoss += field[w.y][w.x];

    // We've reached the goal
    if (w.x === field[0].length - 1 && w.y === field.length - 1) {
      return w.heatLoss;
    }

    const encoded = encodeWalkerState(w);
    const existing = visited.get(encoded);

    if (!existing) {
      heap.insert(w.heatLoss + manhattanRemaining(w.x, w.y, field), w);
      visited.set(encoded, w.heatLoss);
    }

    return false;
  };

  while (!heap.isEmpty()) {
    const cur = heap.extractMinimum() as WalkerNode;
    const w = cur.value;

    let done: number | false = false;

    if (part2) {
      const a = w.timesInSameDirection < 10 && insert(move(w));

      if (w.timesInSameDirection >= 4) {
        insert(move(w, 1));
        insert(move(w, -1));
      }

      done = (w.timesInSameDirection >= 3 && a);
    } else {
      const a = w.timesInSameDirection < 3 && insert(move(w));
      const b = insert(move(w, 1));
      const c = insert(move(w, -1));
      done = a || b || c;
    }

    if (done) {
      return done;
    }
  }

  throw new Error('Ran out of walkers');
};

export const part1 = (input: string): number => solve(input);
export const part2 = (input: string): number => solve(input, true);
