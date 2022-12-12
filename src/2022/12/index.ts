import { split } from '@lib/processing';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

type Field = number[][];
type Pos = { x: number, y: number };
type Visitor = { pos: Pos, steps: number };

interface VisitedNode extends INode<number, Visitor> { value: Visitor }

const A = 'a'.charCodeAt(0);
const Z = 'z'.charCodeAt(0);

const neighbours: Pos[] = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

const parseInput = (input: string): { start: Pos, end: Pos, field: Field } => {
  const start: Pos = { x: 0, y: 0 };
  const end: Pos = { x: 0, y: 0 };

  const field = split(input)
    .map((line, y) => line.split('').map((n, x) => {
      if (n === 'S') {
        start.x = x;
        start.y = y;

        return A;
      }

      if (n === 'E') {
        end.x = x;
        end.y = y;

        return Z;
      }

      return n.charCodeAt(0);
    }));

  return { start, end, field };
};

const run = (
  start: Pos,
  field: Field,
  climbing: boolean,
  test: (pos: Pos) => boolean,
) => {
  const visited: Set<number> = new Set();
  const toVisit: FibonacciHeap<number, Visitor> = new FibonacciHeap();
  toVisit.insert(0, { pos: start, steps: 0 });

  while (toVisit.size()) {
    const { value: { pos, steps } } = toVisit.extractMinimum() as VisitedNode;
    if (visited.has((pos.x << 7) + pos.y)) {
      continue;
    }

    visited.add((pos.x << 7) + pos.y);

    for (let i = 0; i < neighbours.length; i += 1) {
      const x = pos.x + neighbours[i].x;
      const y = pos.y + neighbours[i].y;

      if (x < 0 || x === field[0].length || y < 0 || y === field.length) {
        continue;
      }

      const diff = climbing
        ? field[y][x] - field[pos.y][pos.x]
        : field[pos.y][pos.x] - field[y][x];

      if (diff > 1 || visited.has((x << 7) + y)) {
        continue;
      }

      const next = { x, y };

      if (test(next)) {
        return steps + 1;
      }

      toVisit.insert(steps + diff, { pos: next, steps: steps + 1 });
    }
  }

  throw new Error();
};

export const part1 = (input: string): number => {
  const { start, end, field } = parseInput(input);

  return run(
    start,
    field,
    true,
    (pos) => pos.x === end.x && pos.y === end.y,
  );
};

export const part2 = (input: string): number => {
  const { end, field } = parseInput(input);

  return run(
    end,
    field,
    false,
    (pos) => field[pos.y][pos.x] === A,
  );
};
