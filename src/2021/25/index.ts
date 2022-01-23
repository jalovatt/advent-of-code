/* eslint-disable no-bitwise */
import CircuitBreaker from '@lib/CircuitBreaker';
import { log } from '@lib/logging';
import { split } from '@lib/processing';

const ECuke = '>';
const SCuke = 'v';
type Cucumber = typeof ECuke | typeof SCuke;
type CucumberField = Record<number, Cucumber>;

const encodeCoord = (y: number, x: number): number => (y << 8) + x;
const decodeCoord = {
  y: (coord: number): number => coord >> 8,
  x: (coord: number): number => coord & 0b11111111,
};

const wrap = (n: number, m: number): number => n % m;

const prepareField = (input: string): [CucumberField, number, number] => {
  const field: CucumberField = {};

  const lines = split(input);
  const height = lines.length;
  const width = lines[0].trim().length;

  for (let y = 0; y < lines.length; y += 1) {
    const l = lines[y].trim();

    for (let x = 0; x < l.length; x += 1) {
      const c = l[x];

      // eslint-disable-next-line no-continue
      if (c === '.') { continue; }

      field[encodeCoord(y, x)] = c as Cucumber;
    }
  }

  return [field, height, width];
};

export class CucumberSim {
  field: CucumberField;
  stepsTaken: number;

  height: number;
  width: number;

  constructor(input: string) {
    [this.field, this.height, this.width] = prepareField(input);
    this.stepsTaken = 0;
  }

  // Returns number of moves
  step(): number {
    const next: CucumberField = {};
    let moved = 0;

    const southToVisit = [];

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const coord = encodeCoord(y, x);
        const c = this.field[coord];

        // eslint-disable-next-line no-continue
        if (!c) { continue; }

        if (c === SCuke) {
          southToVisit.push(coord);
        } else {
          const target = encodeCoord(y, wrap(x + 1, this.width));
          if (!this.field[target]) {
            next[target] = ECuke;
            moved += 1;
          } else {
            next[coord] = ECuke;
          }
        }
      }
    }

    for (let i = 0; i < southToVisit.length; i += 1) {
      const coord = southToVisit[i];

      const target = encodeCoord(
        wrap(decodeCoord.y(coord) + 1, this.height),
        decodeCoord.x(coord),
      );

      if (!(this.field[target] === SCuke || next[target] === ECuke)) {
        next[target] = SCuke;
        moved += 1;
      } else {
        next[coord] = SCuke;
      }
    }

    this.stepsTaken += 1;
    this.field = next;
    return moved;
  }

  runUntilStopped(): number {
    let t = 0;

    const breaker = new CircuitBreaker(10000, (moved) => log(`t=${t}, ${moved} cucumbers moved`));
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const moved = this.step();
      t += 1;
      if (!moved) { break; }

      breaker.tick(moved);
    }

    return t;
  }

  describe() {
    const arr: string[] = [];

    for (let y = 0; y < this.height; y += 1) {
      const row = [];

      for (let x = 0; x < this.width; x += 1) {
        row.push(this.field[encodeCoord(y, x)] || '.');
      }

      arr.push(row.join(''));
    }

    return arr.join('\n');
  }

  print() {
    log(this.describe());
  }
}

export const a = (input: string) => {
  const sim = new CucumberSim(input);

  return sim.runUntilStopped();
};
