import CircuitBreaker from '@lib/CircuitBreaker';
import { dir, log } from '@lib/logging';
import { split2D } from '@lib/processing';

enum Tile {
  Empty = '.',
  MirrorNE = '/',
  MirrorNW = '\\',
  SplitterNS = '|',
  SplitterEW = '-',
}

enum Direction {
  N,
  S,
  E,
  W,
}

type Field = Tile[][];
type Beam = { x: number; y: number, direction: Direction };

const encodePos = (x: number, y: number) => (y << 8) + x;
const decodePos = {
  x: (pos: number) => pos & 0b11111111,
  y: (pos: number) => pos >> 8,
};

const encodeBeam = (b: Beam) => (((b.direction << 8) + b.y) << 8) + b.x;

const moveBeam = (b: Beam, field: Field): boolean => {
  switch (b.direction) {
    case Direction.N: {
      b.y -= 1;

      return b.y >= 0;
    }
    case Direction.S: {
      b.y += 1;

      return b.y < field.length;
    }
    case Direction.E: {
      b.x += 1;

      return b.x < field[0].length;
    }
    case Direction.W:
    default: {
      b.x -= 1;

      return b.x >= 0;
    }
  }
};

const printField = (field: Field, visited: Set<number>) => {
  const out = field.map((row) => row.concat());

  for (const v of visited.values()) {
    const x = decodePos.x(v);
    const y = decodePos.y(v);

    out[y][x] = '#' as Tile;
  }

  log(out.map((row) => row.join('')).join('\n'));
};

export const part1 = (input: string): number => {
  const field = split2D(input) as Field;
  const beams: Beam[] = [{ x: -1, y: 0, direction: Direction.E }];
  const energized: Set<number> = new Set();
  const seenBeams: Set<number> = new Set();

  const pushBeam = (b: Beam) => {
    const encoded = encodeBeam(b);

    if (!seenBeams.has(encoded)) {
      beams.push(b);
      seenBeams.add(encoded);
    }
  };

  const breaker = new CircuitBreaker(100000, () => { dir(beams); });
  while (beams.length > 0) {
    breaker.tick();
    const cur = beams.pop()!;

    const stillActive = moveBeam(cur, field);
    if (!stillActive) { continue; }

    energized.add(encodePos(cur.x, cur.y));

    const newTile = field[cur.y][cur.x];

    switch (newTile) {
      case Tile.MirrorNE: {
        switch (cur.direction) {
          case Direction.N: {
            cur.direction = Direction.E;
            pushBeam(cur);
            break;
          }
          case Direction.S: {
            cur.direction = Direction.W;
            pushBeam(cur);
            break;
          }
          case Direction.E: {
            cur.direction = Direction.N;
            pushBeam(cur);
            break;
          }
          case Direction.W:
          default: {
            cur.direction = Direction.S;
            pushBeam(cur);
            break;
          }
        }
        break;
      }
      case Tile.MirrorNW: {
        switch (cur.direction) {
          case Direction.N: {
            cur.direction = Direction.W;
            pushBeam(cur);
            break;
          }
          case Direction.S: {
            cur.direction = Direction.E;
            pushBeam(cur);
            break;
          }
          case Direction.E: {
            cur.direction = Direction.S;
            pushBeam(cur);
            break;
          }
          case Direction.W:
          default: {
            cur.direction = Direction.N;
            pushBeam(cur);
            break;
          }
        }
        break;
      }
      case Tile.SplitterEW: {
        if (cur.direction === Direction.E || cur.direction === Direction.W) {
          pushBeam(cur);
        } else {
          pushBeam({ x: cur.x, y: cur.y, direction: Direction.W });
          pushBeam({ x: cur.x, y: cur.y, direction: Direction.E });
        }
        break;
      }
      case Tile.SplitterNS: {
        if (cur.direction === Direction.N || cur.direction === Direction.S) {
          pushBeam(cur);
        } else {
          pushBeam({ x: cur.x, y: cur.y, direction: Direction.N });
          pushBeam({ x: cur.x, y: cur.y, direction: Direction.S });
        }
        break;
      }
      case Tile.Empty:
      default: {
        pushBeam(cur);
        break;
      }
    }
  }

  // printField(field, energized);
  // dir(energized);

  return energized.size;
};
export const part2 = (input: string): number => {};
