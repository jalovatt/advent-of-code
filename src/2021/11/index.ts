import { split, splitToNumber } from '@lib/processing';
import { Simulator2D } from '@lib/Simulator';
import type { Field2D, Cell2D } from '@lib/Simulator';

type Octopus = Cell2D<number>;

class Octopuses extends Simulator2D<number> {
  totalFlashes: number;
  size: number;

  constructor(field: Field2D<number>) {
    super(field);

    this.size = field.length * field[0].length;
    this.totalFlashes = 0;
  }

  increase(): Octopus[] {
    const toFlash: Octopus[] = [];

    this.iterate((octo: Octopus) => {
      // eslint-disable-next-line no-param-reassign
      octo.value += 1;

      if (octo.value > 9) {
        toFlash.push(octo);
      }
    });

    return toFlash;
  }

  flash(toFlash: Octopus[]): Octopus[] {
    const flashed: Set<Octopus> = new Set(toFlash);

    while (toFlash.length) {
      const next = toFlash.pop()!;

      this.iterateNeighbours(next, (octo: Octopus) => {
        // eslint-disable-next-line no-param-reassign
        octo.value += 1;

        if (octo.value > 9 && !flashed.has(octo)) {
          toFlash.push(octo);
          flashed.add(octo);
        }
      });
    }

    return Array.from(flashed);
  }

  // eslint-disable-next-line class-methods-use-this
  reset(flashed: Octopus[]) {
    // eslint-disable-next-line no-param-reassign
    flashed.forEach((octo) => { octo.value = 0; });
  }

  update(): number {
    const toFlash = this.increase();
    const flashed = this.flash(toFlash);

    this.totalFlashes += flashed.length;
    this.reset(flashed);

    return flashed.length;
  }

  runUntilAllFlash() {
    let t = 1;

    while (this.update() !== this.size) {
      t += 1;
    }

    return t;
  }
}

export const a = (input: string) => {
  const field = split(input)
    .map((line, y) => splitToNumber(line, '').map((value, x) => ({ x, y, value })));

  const octopuses = new Octopuses(field);
  octopuses.run(100);

  return octopuses.totalFlashes;
};

export const b = (input: string) => {
  const field = split(input)
    .map((line, y) => splitToNumber(line, '').map((value, x) => ({ x, y, value })));

  const octopuses = new Octopuses(field);
  const allFlash = octopuses.runUntilAllFlash();

  return allFlash;
};
