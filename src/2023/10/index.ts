import CircuitBreaker from '@lib/CircuitBreaker';
import { dir, log } from '@lib/logging';
import { split, split2D } from '@lib/processing';

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

const WickablePairs: Record<Direction, [Tile[], Tile[]]> = {
  [Direction.N]: [
    [Tile.NS, Tile.NW, Tile.SW],
    [Tile.NS, Tile.NE, Tile.SE],
  ],
  [Direction.S]: [
    [Tile.NS, Tile.NW, Tile.SW],
    [Tile.NS, Tile.NE, Tile.SE],
  ],
  [Direction.E]: [
    [Tile.EW, Tile.NE, Tile.NW],
    [Tile.EW, Tile.SE, Tile.SW],
  ],
  [Direction.W]: [
    [Tile.EW, Tile.NE, Tile.NW],
    [Tile.EW, Tile.SE, Tile.SW],
  ],
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

  getConnections(pos: number, allowGround = false): number[] {
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

  // countVisitedTilesInDirection(from: number, direction: Direction): number {
  //   let count = 0;
  //   let cur = from;

  //   switch (direction) {
  //     case Direction.N: {
  //       while (cur >= 0) {
  //         cur -= this.rowLength;
  //         if (this.visited.has(cur)) {
  //           count += 1;
  //         }
  //       }

  //       break;
  //     }
  //     case Direction.S: {
  //       while (cur < this.maze.length) {
  //         cur += this.rowLength;
  //         if (this.visited.has(cur)) {
  //           count += 1;
  //         }
  //       }

  //       break;
  //     }
  //     case Direction.E: {
  //       while (cur % this.rowLength < this.rowLength - 1) {
  //         cur += 1;
  //         if (this.visited.has(cur)) {
  //           count += 1;
  //         }
  //       }
  //       break;
  //     }
  //     case Direction.W:
  //     default: {
  //       while (cur % this.rowLength > 0) {
  //         cur -= 1;
  //         if (this.visited.has(cur)) {
  //           count += 1;
  //         }
  //       }
  //       break;
  //     }
  //   }

  //   return count;
  // }
}

export const part1 = (input: string): number => new Walker(input).run();
export const part2 = (input: string): number => {
  const walker = new Walker(input);
  walker.run();

  const top = new Array(walker.nColumns).fill(null).map((_, i) => i);
  const bottom = new Array(walker.nColumns).fill(null).map((_, i) => walker.maze.length - walker.nColumns + i);
  const left = new Array(walker.nRows - 2).fill(null).map((_, i) => (i + 1) * walker.nColumns);
  const right = new Array(walker.nRows - 2).fill(null).map((_, i) => (i + 2) * walker.nColumns - 1);

  const all = top.concat(bottom, left, right);
  const perimeterGroundPositions = Array.from(new Set(all.filter((n) => walker.maze[n] === Tile.Ground)));

  const visitedFilling: Set<number> = new Set(perimeterGroundPositions);
  const visitedWicks: Set<number> = new Set();
  const toVisit: number[] = [...perimeterGroundPositions];

  const allDirections = [Direction.N, Direction.S, Direction.E, Direction.W];

  // type Wick = {
  //   positions: [number, number];
  //   direction: Direction;
  // };

  // Run a wick in a straight line
  // Hopefully there are no corners/intersections to worry about

  const runWick = (a: number, b: number, d: Direction) => {
    const aNext = walker.getRelativePosition(a, d);
    const bNext = walker.getRelativePosition(b, d);

    let foundEmpty = false;

    if (aNext !== null) {
      if (walker.maze[aNext] === Tile.Ground && !visitedFilling.has(aNext)) {
        toVisit.push(aNext);
        visitedFilling.add(aNext);
        foundEmpty = true;
      }
    }

    if (bNext !== null) {
      if (walker.maze[bNext] === Tile.Ground && !visitedFilling.has(bNext)) {
        toVisit.push(bNext);
        visitedFilling.add(bNext);
        foundEmpty = true;
      }
    }

    if (!foundEmpty && aNext !== null && bNext !== null) {
      if (
        WickablePairs[d][0].includes(walker.maze[aNext])
        && WickablePairs[d][1].includes(walker.maze[bNext])
        && !visitedWicks.has(aNext * 100000 + bNext)
      ) {
        visitedWicks.add(aNext * 100000 + bNext);
        runWick(aNext, bNext, d);
      }
    }
  };

  const breaker = new CircuitBreaker(
    10000,
    () => dir({ toVisit, nVisitedWicking: visitedWicks.size }),
  );

  while (toVisit.length) {
    breaker.tick();
    const cur = toVisit.pop()!;

    // Check adjacent tiles
    for (const d of allDirections) {
      const rel = walker.getRelativePosition(cur, d)!;

      if (walker.maze[rel] === Tile.Ground && !visitedFilling.has(rel)) {
        toVisit.push(rel);
        visitedFilling.add(rel);
      }
    }

    const nPos = walker.getRelativePosition(cur, Direction.N);
    const sPos = walker.getRelativePosition(cur, Direction.S);
    const ePos = walker.getRelativePosition(cur, Direction.E);
    const wPos = walker.getRelativePosition(cur, Direction.W);

    if (nPos !== null) {
      const n = walker.maze[nPos];

      if (ePos !== null) {
        const e = walker.maze[ePos];

        const nePos = walker.getRelativePosition(nPos, Direction.E)!;
        const ne = walker.maze[nePos];

        if (WickablePairs.N[0].includes(n) && WickablePairs.N[1].includes(ne)) {
          runWick(nPos, nePos, Direction.N);
        }

        if (WickablePairs.E[0].includes(ne) && WickablePairs.E[1].includes(e)) {
          runWick(nePos, ePos, Direction.E);
        }

        if (ne === Tile.Ground && !visitedFilling.has(nePos)) {
          toVisit.push(nePos);
          visitedFilling.add(nePos);
        }
      }

      if (wPos !== null) {
        const w = walker.maze[wPos];

        const nwPos = walker.getRelativePosition(nPos, Direction.W)!;
        const nw = walker.maze[nwPos];

        if (WickablePairs.N[0].includes(n) && WickablePairs.N[1].includes(nw)) {
          runWick(nPos, nwPos, Direction.N);
        }

        if (WickablePairs.W[0].includes(nw) && WickablePairs.W[1].includes(w)) {
          runWick(nwPos, wPos, Direction.W);
        }

        if (nw === Tile.Ground && !visitedFilling.has(nwPos)) {
          toVisit.push(nwPos);
          visitedFilling.add(nwPos);
        }
      }
    }

    if (sPos !== null) {
      const s = walker.maze[sPos];

      if (ePos !== null) {
        const e = walker.maze[ePos];

        const sePos = walker.getRelativePosition(sPos, Direction.E)!;
        const se = walker.maze[sePos];

        if (WickablePairs.S[0].includes(s) && WickablePairs.S[1].includes(se)) {
          runWick(sPos, sePos, Direction.S);
        }

        if (WickablePairs.E[0].includes(se) && WickablePairs.E[1].includes(e)) {
          runWick(sePos, ePos, Direction.E);
        }

        if (se === Tile.Ground && !visitedFilling.has(sePos)) {
          toVisit.push(sePos);
          visitedFilling.add(sePos);
        }
      }

      if (wPos !== null) {
        const w = walker.maze[wPos];

        const swPos = walker.getRelativePosition(sPos, Direction.W)!;
        const sw = walker.maze[swPos];

        if (WickablePairs.S[0].includes(s) && WickablePairs.S[1].includes(sw)) {
          runWick(sPos, swPos, Direction.S);
        }

        if (WickablePairs.W[0].includes(sw) && WickablePairs.W[1].includes(w)) {
          runWick(swPos, wPos, Direction.W);
        }

        if (sw === Tile.Ground && !visitedFilling.has(swPos)) {
          toVisit.push(swPos);
          visitedFilling.add(swPos);
        }
      }
    }
  }

  dir({ perimeterGroundPositions, visitedFilling, visitedWicks });

  return walker.maze.length - walker.visited.size - visitedFilling.size;
};
