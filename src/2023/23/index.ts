import { dir, log } from '@lib/logging';
import { split, split2D } from '@lib/processing';
import { FibonacciHeap } from '@tyriar/fibonacci-heap';

const encodePos = (x: number, y: number) => (y << 8) + x;
const decodePos = {
  x: (v: number) => v & 0b11111111,
  y: (v: number) => v >>> 8,
};

enum Tile {
  Empty = '.',
  Forest = '#',
  SlopeS = 'v',
  SlopeE = '>',
}

type NavigableTile = Exclude<Tile, Tile.Forest>

type Node = {
  id: number;
  type: NavigableTile;
  neighbours: Map<Node, number>;
};

type State = {
  node: Node;
  seen: Set<Node>;
};

type Field = Tile[][];

const Slopes = {
  // '^': true,
  v: true,
  '>': true,
  // '<': true,
};

const print = (field: Field, path: Set<number>) => {
  const out = field.map((row) => [...row]);

  for (const p of path.values()) {
    const x = decodePos.x(p);
    const y = decodePos.y(p);

    out[y][x] = 'O' as Tile;
  }

  log(out.map((row) => row.join('')).join('\n'));
};

const solve = (input: string, part2 = false): number => {
  const field = split2D(input) as Field;
  const nodes: Map<number, Node> = new Map();

  const upsertNode = (pos: number, type: Tile): Node => {
    if (!nodes.has(pos)) {
      const n: Node = { id: pos, type: type as NavigableTile, neighbours: new Map() };
      nodes.set(pos, n);

      return n;
    }

    return nodes.get(pos)!;
  };

  const connect: Record<string, (n: Node, x: number, y: number) => void> = {
    up: (n, x, y) => {
      if (y > 0) {
        const yUp = y - 1;
        const tUp = field[yUp][x];

        if (
          tUp !== Tile.Forest
          && (tUp !== Tile.SlopeS || part2)
        ) {
          n.neighbours.set(upsertNode(encodePos(x, yUp), tUp), 1);
        }
      }
    },
    down: (n, x, y) => {
      if (y < field.length - 1) {
        const yDown = y + 1;
        const tDown = field[yDown][x];

        if (
          tDown !== Tile.Forest
          // && (tDown !== Tile.SlopeN || part2)
        ) {
          n.neighbours.set(upsertNode(encodePos(x, yDown), tDown), 1);
        }
      }
    },
    left: (n, x, y) => {
      if (x > 1) {
        const xLeft = x - 1;
        const tLeft = field[y][xLeft];

        if (
          tLeft !== Tile.Forest
          && (tLeft !== Tile.SlopeE || part2)
        ) {
          n.neighbours.set(upsertNode(encodePos(xLeft, y), tLeft), 1);
        }
      }
    },
    right: (n, x, y) => {
      if (x < field[0].length - 1) {
        const xRight = x + 1;
        const tRight = field[y][xRight];

        if (
          tRight !== Tile.Forest
          // && (tRight !== Tile.SlopeW || part2)
        ) {
          n.neighbours.set(upsertNode(encodePos(xRight, y), tRight), 1);
        }
      }
    },
  };

  field.forEach((line, y) => line.forEach((char, x) => {
    const encoded = encodePos(x, y);

    const t = field[y][x];
    const n = upsertNode(encoded, t as NavigableTile);

    if (t === Tile.Forest) {
      return;
    }

    if (t in Slopes && !part2) {
      switch (t) {
        case 'v': {
          connect.down(n, x, y);
          return;
        }
        case '>':
        default: {
          connect.right(n, x, y);
          return;
        }
      }
    }

    connect.up(n, x, y);
    connect.left(n, x, y);
    connect.down(n, x, y);
    connect.right(n, x, y);
  }));

  /*
    1. There are no upward or leftward slopes in the sample or input.
    2. There are no empty tiles with more than two empty neighbours (intersections)

    We can therefore safely reduce the graph to just the start, end, and slope
    tiles, weighted equal to the walking distance between them.

    S..
      v
      .>...v
      v
      .
      E

    -->

    S <- 3 -> v
                2 -> >
                      4 -> v
                2 -> v
                      2 -> E
  */

  // Find all slope tiles
  // For each of them, plus start + end
  //   For each edge
  //     If edge is not another slope (we've reduced it already)
  //       BFS to find all slopes down that subpath
  //         Reduce the ends two together @ cost = the length of the walk, respecting
  //         the slope direction

  const start = nodes.get(encodePos(1, 0))!;
  const end = nodes.get(encodePos(field[0].length - 2, field.length - 1))!;
  const reducesToVisit: Node[] = [end, start];

  while (reducesToVisit.length) {
    const cur = reducesToVisit.pop()!;

    for (const neighbour of cur.neighbours) {
      if (neighbour[0].type !== Tile.Empty) { continue; }

      let at = neighbour[0];
      let cost = neighbour[1];

      // while (at.type === Tile.Empty) {
        // const next = at.neighbours.f
      // }
    }
  }

  // const toVisit: State[] = [{ node: start, seen: new Set([start]) }];
  const toVisit: FibonacciHeap<number, State> = new FibonacciHeap();
  toVisit.insert(-1, { node: start, seen: new Set([start]) });
  const finished: State[] = [];

  const move = (cur: State, node: Node) => {
    if (cur.seen.has(node)) {
      return;
    }

    const next = {
      node,
      seen: new Set([...cur.seen, node]),
    };

    toVisit.insert(-next.seen.size, next);
  };

  while (toVisit.size()) {
    const cur = toVisit.extractMinimum()!.value!;

    if (cur.node === end) {
      finished.push(cur);
      continue;
    }

    for (const neighbour of cur.node.neighbours.keys()) {
      move(cur, neighbour);
    }
  }

  // dir(finished);
  const longest = finished.sort((a, b) => b.seen.size - a.seen.size)[0];

  // print(field, longest.seen);
  // dir(seen);
  // dir(finished.map((f) => f.seen.size));
  // dir([...longest.seen].map((v) => `${decodePos.x(v)},${decodePos.y(v)}`));

  return longest.seen.size - 1;
};

export const part1 = (input: string): number => solve(input);
export const part2 = (input: string): number => solve(input, true);
