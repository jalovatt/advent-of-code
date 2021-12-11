import { split, splitToNumber } from '../../utilities/processing';

type Cell = { v: number, y: number, x: number };
type Field = Cell[][];
type CellCallback = (cell: Cell) => void;

class Octopuses {
  neighbours = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];

  totalFlashes: number;
  size: number;
  field: Field;

  constructor(field: Field) {
    this.field = field;
    this.size = field.length * field[0].length;
    this.totalFlashes = 0;
  }

  iterate(fn: CellCallback) {
    for (let y = 0; y < this.field.length; y += 1) {
      for (let x = 0; x < this.field.length; x += 1) {
        fn(this.field[y][x]);
      }
    }
  }

  iterateNeighbours(cell: Cell, fn: CellCallback) {
    for (let i = 0; i < this.neighbours.length; i += 1) {
      const [ny, nx] = this.neighbours[i];
      const nCell = this.field[cell.y + ny]?.[cell.x + nx];

      if (nCell !== undefined) {
        fn(nCell);
      }
    }
  }

  increase(): Cell[] {
    const toFlash: Cell[] = [];

    this.iterate((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.v += 1;

      if (cell.v > 9) {
        toFlash.push(cell);
      }
    });

    return toFlash;
  }

  flash(toFlash: Cell[]): Cell[] {
    const flashed: Set<Cell> = new Set(toFlash);

    while (toFlash.length) {
      const next = toFlash.pop()!;

      this.iterateNeighbours(next, (cell) => {
        // eslint-disable-next-line no-param-reassign
        cell.v += 1;

        if (cell.v > 9 && !flashed.has(cell)) {
          toFlash.push(cell);
          flashed.add(cell);
        }
      });
    }

    return Array.from(flashed);
  }

  // eslint-disable-next-line class-methods-use-this
  reset(flashed: Cell[]) {
    // eslint-disable-next-line no-param-reassign
    flashed.forEach((cell) => { cell.v = 0; });
  }

  update(): number {
    const toFlash = this.increase();
    const flashed = this.flash(toFlash);

    this.totalFlashes += flashed.length;
    this.reset(flashed);

    return flashed.length;
  }

  run(times = 1) {
    for (let i = 0; i < times; i += 1) {
      this.update();
    }
  }

  runUntilAllFlash() {
    let t = 1;

    while (this.update() !== this.size) {
      t += 1;
    }

    return t;
  }

  print() {
    const str = this.field.map((row) => (
      row.map((cell) => (
        cell.v.toString().padStart(2, ' ')
      )).join(' ')
    )).join('\n');

    // eslint-disable-next-line no-console
    console.log(str);
  }
}

export const a = (input: string) => {
  const field = split(input)
    .map((line, y) => splitToNumber(line, '').map((v, x) => ({ x, y, v })));

  const octopuses = new Octopuses(field);
  octopuses.run(100);

  return octopuses.totalFlashes;
};

export const b = (input: string) => {
  const field = split(input)
    .map((line, y) => splitToNumber(line, '').map((v, x) => ({ x, y, v })));

  const octopuses = new Octopuses(field);
  const allFlash = octopuses.runUntilAllFlash();

  return allFlash;
};
