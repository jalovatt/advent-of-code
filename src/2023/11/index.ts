import { split2D } from '@lib/processing';

type Point2 = {
  x: number;
  y: number;
};

const parseInput = (input: string, expansionFactor: number): Point2[] => {
  const field = split2D(input);
  const galaxies: Point2[] = [];

  const populatedRows = new Set();
  const emptyColumns = new Set(new Array(field[0].length).fill(null).map((_, i) => i));

  for (let y = 0; y < field.length; y += 1) {
    const rowExpansionOffset = (y - populatedRows.size) * (expansionFactor - 1);

    for (let x = 0; x < field[0].length; x += 1) {
      if (field[y][x] === '#') {
        populatedRows.add(y);
        emptyColumns.delete(x);

        galaxies.push({
          x,
          y: y + rowExpansionOffset,
        });
      }
    }
  }

  for (const x of Array.from(emptyColumns.keys()).reverse()) {
    for (const g of galaxies) {
      if (g.x > x) {
        g.x += expansionFactor - 1;
      }
    }
  }

  return galaxies;
};

const manhattan = (a: Point2, b: Point2): number => {
  const x = a.x - b.x;
  const y = a.y - b.y;

  // Math.abs can be super slow over a large number of calls. Doing this got me
  // from 35ms down to 8.
  return (x < 0 ? -x : x) + (y < 0 ? -y : y);
};

const sumShortestPaths = (input: string, expansionFactor: number): number => {
  const galaxies = parseInput(input, expansionFactor);

  let sum = 0;
  for (let a = 0; a < galaxies.length - 1; a += 1) {
    for (let b = a + 1; b < galaxies.length; b += 1) {
      sum += manhattan(galaxies[a], galaxies[b]);
    }
  }

  return sum;
};

export const part1 = (input: string): number => sumShortestPaths(input, 2);
export const part2 = (input: string, expansionFactor = 1000000): number => (
  sumShortestPaths(input, expansionFactor)
);
