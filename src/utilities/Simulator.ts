/*
  Provides a framework for running 2D and 3D cell simulations in a finite space,
  i.e. cellular automata.

  Use:
  - Create the class instance
  - Implement the .update() method, making use of .iterate() and .iterateNeighbours()
    to mutate each cell
  - Use .run(N) to update the simulation N steps

  Limitations:
  - The simulator field is assumed to be the same size in all dimensions
  - The simulator field cannot be resized
  - The entire field is stored and iterated on, so large simulations may have
    memory or performance issues.

  Simulations in a variable-sized field with only sparse data should probably
  use a different structure, such as an object of { [`${x},${y}`]: value }
*/

// eslint-disable-next-line max-classes-per-file
interface Cell<T> { value: T }
export interface Cell2D<T> extends Cell<T> { x: number, y: number }
export interface Cell3D<T> extends Cell2D<T> { z: number }

export type Field2D<T> = Cell2D<T>[][];
export type Field3D<T> = Cell3D<T>[][][];

export type Coord2D = [number, number];
export type Coord3D = [number, number, number];

export type Cell2DCallback<T> = (cell: Cell2D<T>) => any;
export type Cell3DCallback<T> = (cell: Cell3D<T>) => any;

const getNeighbours2D = (includeDiagonals = true): Coord2D[] => {
  const out: Coord2D[] = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  if (includeDiagonals) {
    out.push(
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    );
  }

  return out;
};

const getNeighbours3D = (includeDiagonals = true): Coord3D[] => {
  const out: Coord3D[] = [
    [-1, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ];

  if (includeDiagonals) {
    out.push(
      [1, 1, 0],
      [1, -1, 0],
      [-1, 1, 0],
      [-1, -1, 0],

      [-1, 0, -1],
      [0, 1, -1],
      [1, 0, -1],
      [0, -1, -1],
      [1, 1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, -1],

      [-1, 0, 1],
      [0, 1, 1],
      [1, 0, 1],
      [0, -1, 1],
      [1, 1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [-1, -1, 1],
    );
  }

  return out;
};

export class Simulator2D<T> {
  field: Field2D<T>;
  neighbours: Coord2D[];

  constructor(field: Field2D<T>, includeDiagonalNeighbours = true) {
    this.field = field;
    this.neighbours = getNeighbours2D(includeDiagonalNeighbours);
  }

  iterate(fn: Cell2DCallback<T>) {
    for (let y = 0; y < this.field.length; y += 1) {
      for (let x = 0; x < this.field.length; x += 1) {
        fn(this.field[y][x]);
      }
    }
  }

  iterateNeighbours(cell: Cell2D<T>, fn: Cell2DCallback<T>) {
    for (let i = 0; i < this.neighbours.length; i += 1) {
      const [ny, nx] = this.neighbours[i];
      const nCell = this.field[cell.y + ny]?.[cell.x + nx];

      if (nCell !== undefined) {
        fn(nCell);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  update() {
    // eslint-disable-next-line no-console
    console.log('Update has not been implemented');
  }

  run(times = 1) {
    for (let i = 0; i < times; i += 1) {
      this.update();
    }
  }

  print() {
    const str = this.field.map((row) => (
      row.map((cell) => (
        `${cell.value}`.padStart(2, ' ')
      )).join(' ')
    )).join('\n');

    // eslint-disable-next-line no-console
    console.log(str);
  }
}

export class Simulator3D<T> {
  field: Field3D<T>;
  neighbours: Coord3D[];

  constructor(field: Field3D<T>, includeDiagonalNeighbours = true) {
    this.field = field;
    this.neighbours = getNeighbours3D(includeDiagonalNeighbours);
  }

  iterate(fn: Cell3DCallback<T>) {
    for (let z = 0; z < this.field.length; z += 1) {
      for (let y = 0; y < this.field.length; y += 1) {
        for (let x = 0; x < this.field.length; x += 1) {
          fn(this.field[z][y][x]);
        }
      }
    }
  }

  iterateNeighbours(cell: Cell3D<T>, fn: Cell3DCallback<T>) {
    for (let i = 0; i < this.neighbours.length; i += 1) {
      const [nz, ny, nx] = this.neighbours[i];
      const nCell = this.field[cell.z + nz]?.[cell.y + ny]?.[cell.x + nx];

      if (nCell !== undefined) {
        fn(nCell);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  update() {
    // eslint-disable-next-line no-console
    console.log('Update has not been implemented');
  }

  run(times = 1) {
    for (let i = 0; i < times; i += 1) {
      this.update();
    }
  }

  print() {
    const planes = this.field.map((plane) => (
      plane.map((row) => (
        row.map((cell) => (
          `${cell.value}`.padStart(2, ' ')
        )).join(' ')
      )).join('\n')
    ));

    const out: string[] = [];

    planes.forEach((plane, i) => {
      out.push(`[${i}]:\n${plane}`);
    });

    // eslint-disable-next-line no-console
    console.log(out.join('\n\n'));
  }
}
