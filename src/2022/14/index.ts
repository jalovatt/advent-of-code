import CircuitBreaker from '@lib/CircuitBreaker';
import { log } from '@lib/logging';
import { split } from '@lib/processing';

enum Cell { Air, Rock, Sand, Start }
const CellChars = { [Cell.Air]: '.', [Cell.Rock]: '#', [Cell.Sand]: 'o', [Cell.Start]: 'V' };

type Pos = [number, number];
const ORIGIN: Pos = [500, 0];

class Field {
  map: Map<number, Cell>;
  part2: boolean;
  bounds!: [Pos, Pos];

  constructor(input: string, part2 = false) {
    this.map = new Map();
    this.part2 = part2;

    this.parseInput(input);
    this.setBounds();
  }

  parseInput(input: string) {
    split(input).forEach((line) => {
      const points: Pos[] = line
        .split(' -> ')
        .map((p) => p
          .split(',')
          .map((n) => parseInt(n, 10)) as Pos);

      for (let i = 0; i < points.length - 1; i += 1) {
        const from = points[i];
        const to = points[i + 1];

        // row
        if (from[0] === to[0]) {
          const yDir = Math.sign(to[1] - from[1]);
          for (let y = from[1]; y - yDir !== to[1]; y += yDir) {
            this.set(from[0], y, Cell.Rock);
          }
        // column
        } else {
          const xDir = Math.sign(to[0] - from[0]);
          for (let x = from[0]; x - xDir !== to[0]; x += xDir) {
            this.set(x, from[1], Cell.Rock);
          }
        }
      }
    });
  }

  get(x: number, y: number) {
    if (this.part2 && y >= this.bounds[1][1] + 2) {
      return Cell.Rock;
    }

    return this.map.get((x << 10) + y) || Cell.Air;
  }

  set(x: number, y: number, value: Cell) {
    this.map.set((x << 10) + y, value);
  }

  setBounds() {
    let xMin = Infinity;
    let xMax = 0;
    let yMax = 0;

    this.map.forEach((v, k) => {
      const x = k >> 10;
      const y = k & 1023;

      if (x < xMin) {
        xMin = x;
      } else if (x > xMax) {
        xMax = x;
      }

      if (y > yMax) {
        yMax = y;
      }
    });

    this.bounds = [[xMin, 0], [xMax, yMax]];
  }

  print() {
    const [min, max] = this.bounds;
    const w = 1 + max[0] - min[0];
    const h = 1 + max[1] - min[1];

    const out = new Array(h).fill(null).map(() => new Array(w).fill(CellChars[Cell.Air]));

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const xReal = min[0] + x;
        const yReal = min[1] + y;
        const char = (xReal === ORIGIN[0] && yReal === ORIGIN[1])
          ? CellChars[Cell.Start]
          : CellChars[this.get(xReal, yReal)];
        out[y][x] = char;
      }
    }

    log(out.map((row) => row.join('')).join('\n'));
  }
}

export const parts1 = (input: string): number => {
  const field = new Field(input);

  let count = 0;
  const pos: Pos = [...ORIGIN];

  const [, [, yLimit]] = field.bounds;
  while (pos[1] <= yLimit) {
    const x = pos[0];
    const y = pos[1];

    const below = field.get(x, y + 1);
    if (below === Cell.Air) {
      pos[1] += 1;
      continue;
    }

    const belowLeft = field.get(x - 1, y + 1);
    if (belowLeft === Cell.Air) {
      pos[0] = x - 1;
      pos[1] = y + 1;
      continue;
    }

    const belowRight = field.get(x + 1, y + 1);
    if (belowRight === Cell.Air) {
      pos[0] = x + 1;
      pos[1] = y + 1;
      continue;
    }

    // This one has settled, so we can reset
    count += 1;
    field.set(pos[0], pos[1], Cell.Sand);

    pos[0] = ORIGIN[0];
    pos[1] = ORIGIN[1];
  }

  return count;
};

const run = (input: string, part2 = false): number => {
  const field = new Field(input, part2);

  let count = 0;
  const pos: Pos = [...ORIGIN];

  const breaker = new CircuitBreaker(10000000, () => log(`breaker tripped @ pos = ${pos}, count = ${count}`));

  const [, [, yLimit]] = field.bounds;
  while (pos[1] <= yLimit + 2) {
    breaker.tick();

    const x = pos[0];
    const y = pos[1];

    const below = field.get(x, y + 1);
    if (below === Cell.Air) {
      pos[1] += 1;
      continue;
    }

    const belowLeft = field.get(x - 1, y + 1);
    if (belowLeft === Cell.Air) {
      pos[0] = x - 1;
      pos[1] = y + 1;
      continue;
    }

    const belowRight = field.get(x + 1, y + 1);
    if (belowRight === Cell.Air) {
      pos[0] = x + 1;
      pos[1] = y + 1;
      continue;
    }

    // This one has settled, so we can reset
    count += 1;

    if (part2 && pos[0] === ORIGIN[0] && pos[1] === ORIGIN[1]) {
      break;
    }

    field.set(pos[0], pos[1], Cell.Sand);

    pos[0] = ORIGIN[0];
    pos[1] = ORIGIN[1];
  }

  // field.print();

  return count;
};

export const part1 = (input: string) => run(input);
export const part2 = (input: string) => run(input, true);
