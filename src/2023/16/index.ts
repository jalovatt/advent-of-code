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

const encodePos = (x: number, y: number) => (y << 7) + x;
const decodePos = {
  x: (pos: number) => pos & 0b1111111,
  y: (pos: number) => pos >> 7,
};

const encodeBeam = (b: Beam) => (((b.direction << 7) + b.y) << 7) + b.x;

class BeamRunner {
  field: Field;
  beams: Beam[];
  energized: Set<number>;
  seenBeams: Set<number>;

  constructor(field: Field, origin: Beam) {
    this.field = field;
    this.beams = [origin];
    this.energized = new Set();
    this.seenBeams = new Set();
  }

  pushBeam(b: Beam) {
    const encoded = encodeBeam(b);

    if (!this.seenBeams.has(encoded)) {
      this.beams.push(b);
      this.seenBeams.add(encoded);
    }
  }

  moveBeam(b: Beam): boolean {
    switch (b.direction) {
      case Direction.N: {
        b.y -= 1;

        return b.y >= 0;
      }
      case Direction.S: {
        b.y += 1;

        return b.y < this.field.length;
      }
      case Direction.E: {
        b.x += 1;

        return b.x < this.field[0].length;
      }
      case Direction.W:
      default: {
        b.x -= 1;

        return b.x >= 0;
      }
    }
  }

  applyTile(b: Beam) {
    const newTile = this.field[b.y][b.x];

    switch (newTile) {
      case Tile.MirrorNE: {
        switch (b.direction) {
          case Direction.N: {
            b.direction = Direction.E;
            break;
          }
          case Direction.S: {
            b.direction = Direction.W;
            break;
          }
          case Direction.E: {
            b.direction = Direction.N;
            break;
          }
          case Direction.W:
          default: {
            b.direction = Direction.S;
          }
        }
        this.pushBeam(b);
        break;
      }
      case Tile.MirrorNW: {
        switch (b.direction) {
          case Direction.N: {
            b.direction = Direction.W;
            break;
          }
          case Direction.S: {
            b.direction = Direction.E;
            break;
          }
          case Direction.E: {
            b.direction = Direction.S;
            break;
          }
          case Direction.W:
          default: {
            b.direction = Direction.N;
          }
        }
        this.pushBeam(b);
        break;
      }
      case Tile.SplitterEW: {
        switch (b.direction) {
          case Direction.E:
          case Direction.W: {
            this.pushBeam(b);
            break;
          }
          case Direction.N:
          case Direction.S:
          default: {
            this.pushBeam({ x: b.x, y: b.y, direction: Direction.W });
            this.pushBeam({ x: b.x, y: b.y, direction: Direction.E });
          }
        }
        break;
      }
      case Tile.SplitterNS: {
        switch (b.direction) {
          case Direction.N:
          case Direction.S: {
            this.pushBeam(b);
            break;
          }
          case Direction.E:
          case Direction.W:
          default: {
            this.pushBeam({ x: b.x, y: b.y, direction: Direction.N });
            this.pushBeam({ x: b.x, y: b.y, direction: Direction.S });
          }
        }
        break;
      }
      case Tile.Empty:
      default: {
        this.pushBeam(b);
      }
    }
  }

  run(): number {
    const breaker = new CircuitBreaker(100000, () => { dir(this.beams); });
    while (this.beams.length > 0) {
      breaker.tick();
      const cur = this.beams.pop()!;

      const stillActive = this.moveBeam(cur);
      if (!stillActive) { continue; }

      this.energized.add(encodePos(cur.x, cur.y));

      this.applyTile(cur);
    }

    return this.energized.size;
  }

  print() {
    const out = this.field.map((row) => row.concat());

    for (const v of this.energized.values()) {
      const x = decodePos.x(v);
      const y = decodePos.y(v);

      out[y][x] = '#' as Tile;
    }

    log(out.map((row) => row.join('')).join('\n'));
  }
}

export const part1 = (input: string): number => {
  const field = split2D(input) as Field;

  return new BeamRunner(field, { x: -1, y: 0, direction: Direction.E }).run();
};

export const part2 = (input: string): number => {
  const field = split2D(input) as Field;

  let max = 0;

  const updateMax = (a: number, b: number) => {
    const v = a > b ? a : b;
    max = v > max ? v : max;
  };

  for (let y = 0; y < field.length; y += 1) {
    const a = new BeamRunner(field, { x: -1, y, direction: Direction.E }).run();
    const b = new BeamRunner(field, { x: field[0].length, y, direction: Direction.W }).run();

    updateMax(a, b);
  }

  for (let x = 0; x < field[0].length; x += 1) {
    const a = new BeamRunner(field, { x, y: -1, direction: Direction.S }).run();
    const b = new BeamRunner(field, { x, y: field.length, direction: Direction.N }).run();

    updateMax(a, b);
  }

  return max;
};
