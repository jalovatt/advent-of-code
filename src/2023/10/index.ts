import { split2D } from '@lib/processing';

enum Tile {
  NS = '|', // a vertical pipe connecting north and south.
  EW = '-', // a horizontal pipe connecting east and west.
  NE = 'L', // a 90-degree bend connecting north and east.
  NW = 'J', // a 90-degree bend connecting north and west.
  SW = '7', // a 90-degree bend connecting south and west.
  SE = 'F', // a 90-degree bend connecting south and east.
  Ground = '.', // ground; there is no pipe in this tile.
  Start = 'S', // the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
}

type NavigableTile = Exclude<Tile, Tile.Ground | Tile.Start>;

enum Direction {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
}

const ConnectionDirections: Record<NavigableTile, Direction[]> = {
  [Tile.NS]: [Direction.N, Direction.S],
  [Tile.EW]: [Direction.E, Direction.W],
  [Tile.NW]: [Direction.N, Direction.W],
  [Tile.NE]: [Direction.N, Direction.E],
  [Tile.SE]: [Direction.S, Direction.E],
  [Tile.SW]: [Direction.S, Direction.W],
};

class Walker {
  maze: Tile[];
  nRows: number;
  nColumns: number;
  start: number;
  visited: Map<number, number>;
  toVisit: number[];

  constructor(input: string) {
    const lines = split2D(input);
    this.nRows = lines.length;
    this.nColumns = lines[0].length;
    this.maze = lines.flat() as Tile[];
    this.start = this.maze.indexOf(Tile.Start);
    this.visited = new Map([[this.start, 0]]);
    this.toVisit = [this.start];

    this.maze[this.start] = this.determineStartType();
  }

  determineStartType(): Tile {
    const connectedDirections = Object.values(Direction)
      .filter((d) => {
        const rel = this.getRelativePosition(this.start, d as Direction);

        return rel && this.getConnections(rel).includes(this.start);
      });

    const [type] = Object.entries(ConnectionDirections).find(([, directions]) => (
      connectedDirections.every((d) => directions.includes(d))
    ))!;

    return type as NavigableTile;
  }

  getRelativePosition(pos: number, direction: Direction): number | null {
    switch (direction) {
      case Direction.N: {
        const rel = pos - this.nColumns;
        return rel >= 0 ? rel : null;
      }
      case Direction.S: {
        const rel = pos + this.nColumns;
        return rel < this.maze.length ? rel : null;
      }
      case Direction.E: {
        const rel = pos + 1;
        return rel % this.nColumns > 0 ? rel : null;
      }
      case Direction.W:
      default: {
        const rel = pos - 1;
        return pos % this.nColumns > 0 ? rel : null;
      }
    }
  }

  getConnections(pos: number): number[] {
    const v = this.maze[pos];
    if (v === Tile.Ground || v === Tile.Start) {
      return [];
    }

    const directions = ConnectionDirections[v];

    const connections = [];
    for (const d of directions) {
      connections.push(this.getRelativePosition(pos, d)!);
    }

    return connections;
  }

  step() {
    const cur = this.toVisit.shift()!;
    const adjacent = this.getConnections(cur);

    for (const v of adjacent) {
      if (!this.visited.has(v)) {
        this.visited.set(v, this.visited.get(cur)! + 1);
        this.toVisit.push(v);
      }
    }
  }

  run(): number {
    while (this.toVisit.length) {
      this.step();
    }

    return Math.max(...Array.from(this.visited.values()));
  }
}

export const part1 = (input: string): number => new Walker(input).run();
export const part2 = (input: string): number => {
  const walker = new Walker(input);
  walker.run();

  const verticals = new Set([Tile.NS, Tile.NW, Tile.NE]);

  let enclosed = 0;
  let currentlyInside = false;

  for (const n of walker.maze.keys()) {
    // Start of a row
    if (n === (n / walker.nColumns) >> 0) {
      currentlyInside = false;
    }

    if (walker.visited.has(n)) {
      if (verticals.has(walker.maze[n])) {
        currentlyInside = !currentlyInside;
      }
    } else if (currentlyInside) {
      enclosed += 1;
    }
  }

  return enclosed;
};
