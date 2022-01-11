import { split } from '@lib/processing';
import { Simulator2D, Field2D } from '@lib/Simulator';

const parseInput = (input: string): Field2D<number> => split(input)
  .map((line, y) => line
    .split('')
    .map((char, x) => ({ y, x, value: (char === '#') ? 1 : 0 })));

const mutTurnOnCorners = (field: Field2D<number>) => {
  field[0][0].value = 1;
  field[field.length - 1][0].value = 1;
  field[field.length - 1][field.length - 1].value = 1;
  field[0][field.length - 1].value = 1;
};

const solve = (input: string, steps: number, cornersStuckOn = false): number => {
  const field = parseInput(input);

  if (cornersStuckOn) { mutTurnOnCorners(field); }

  const sim = new Simulator2D(field, true);

  sim.update = () => {
    const next: Field2D<number> = new Array(field.length).fill(null)
      .map((row, y) => new Array(field.length).fill(null).map((col, x) => ({ y, x, value: 0 })));

    sim.iterate((cell) => {
      let neighbourCount = 0;
      sim.iterateNeighbours(cell, (n) => { neighbourCount += n.value; });

      if (neighbourCount === 3 || (cell.value && neighbourCount === 2)) {
        next[cell.y][cell.x].value = 1;
      }
    });

    if (cornersStuckOn) { mutTurnOnCorners(next); }

    sim.field = next;
  };

  sim.run(steps);

  let totalOn = 0;
  sim.iterate((cell) => { totalOn += cell.value; });

  return totalOn;
};

export const part1 = solve;
export const part2 = (input: string, steps: number): number => solve(input, steps, true);
