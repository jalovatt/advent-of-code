import { split } from '@lib/processing';

type Field = number[];
type Instruction = { op: string, x1: number, y1: number, x2: number, y2: number };

const parseInput = (input: string): Instruction[] => split(input).map((line) => {
  const [, op, x1, y1, x2, y2] = line.match(/([^\d]+) (\d+),(\d+) through (\d+),(\d+)/)!;

  return {
    op,
    x1: parseInt(x1, 10),
    y1: parseInt(y1, 10),
    x2: parseInt(x2, 10),
    y2: parseInt(y2, 10),
  };
});

export const part1 = (input: string): number => {
  const field: Field = new Array(1000000).fill(0);
  const instructions = parseInput(input);

  for (let i = 0; i < instructions.length; i += 1) {
    const instruction = instructions[i];

    for (let y = instruction.y1; y <= instruction.y2; y += 1) {
      const rowIndex = y * 1000;

      for (let x = instruction.x1; x <= instruction.x2; x += 1) {
        const index = rowIndex + x;

        if (instruction.op === 'turn on') {
          field[index] = 1;
        } else if (instruction.op === 'turn off') {
          field[index] = 0;
        } else {
          field[index] = (field[index] & 1) ^ 1;
        }
      }
    }
  }

  return field.reduce((acc, cur) => acc + cur);
};

export const part2 = (input: string): number => {
  const field: Field = new Array(1000000).fill(0);
  const instructions = parseInput(input);

  for (let i = 0; i < instructions.length; i += 1) {
    const instruction = instructions[i];

    for (let y = instruction.y1; y <= instruction.y2; y += 1) {
      const rowIndex = y * 1000;

      for (let x = instruction.x1; x <= instruction.x2; x += 1) {
        const index = rowIndex + x;

        if (instruction.op === 'turn on') {
          field[index] += 1;
        } else if (instruction.op === 'turn off') {
          const v = field[index] - 1;
          field[index] = v > 0 ? v : 0;
        } else {
          field[index] += 2;
        }
      }
    }
  }

  return field.reduce((acc, cur) => acc + cur);
};
