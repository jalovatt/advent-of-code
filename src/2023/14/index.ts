import { split } from '@lib/processing';

type Cell = '.' | '#' | 'O';
type Field = Cell[][];

const scoreRocks = (field: Field): number => {
  let score = 0;

  for (let y = 0; y < field.length; y += 1) {
    for (let x = 0; x < field[0].length; x += 1) {
      const cur = field[y][x];

      if (cur !== 'O') {
        continue;
      }

      score += (field.length - y);
    }
  }

  return score;
};

export const part1 = (input: string): number => {
  const field: Field = split(input).map((line) => line.split('') as Cell[]);

  for (let oy = 0; oy < field.length; oy += 1) {
    for (let ox = 0; ox < field[0].length; ox += 1) {
      const cur = field[oy][ox];

      if (cur !== 'O') {
        continue;
      }

      let ty = oy;
      for (let y = oy - 1; y >= 0; y -= 1) {
        if (!field[y] || field[y][ox] !== '.') {
          break;
        }

        ty = y;
      }

      if (ty !== oy) {
        field[ty][ox] = 'O';
        field[oy][ox] = '.';
      }
    }
  }

  return scoreRocks(field);
};

const runCycle = (field: Field) => {
  // North
  for (let oy = 0; oy < field.length; oy += 1) {
    for (let ox = 0; ox < field[0].length; ox += 1) {
      const cur = field[oy][ox];

      if (cur !== 'O') {
        continue;
      }

      let ty = oy;
      for (let y = oy - 1; y >= 0; y -= 1) {
        if (field[y][ox] !== '.') {
          break;
        }

        ty = y;
      }

      if (ty !== oy) {
        field[ty][ox] = 'O';
        field[oy][ox] = '.';
      }
    }
  }

  // West
  for (let ox = 0; ox < field[0].length; ox += 1) {
    for (let oy = 0; oy < field.length; oy += 1) {
      const cur = field[oy][ox];

      if (cur !== 'O') {
        continue;
      }

      let tx = ox;
      for (let x = ox - 1; x >= 0; x -= 1) {
        if (field[oy][x] !== '.') {
          break;
        }

        tx = x;
      }

      if (tx !== ox) {
        field[oy][tx] = 'O';
        field[oy][ox] = '.';
      }
    }
  }

  // South
  for (let oy = field.length - 1; oy >= 0; oy -= 1) {
    for (let ox = 0; ox < field[0].length; ox += 1) {
      const cur = field[oy][ox];

      if (cur !== 'O') {
        continue;
      }

      let ty = oy;
      for (let y = oy + 1; y < field.length; y += 1) {
        if (field[y][ox] !== '.') {
          break;
        }

        ty = y;
      }

      if (ty !== oy) {
        field[ty][ox] = 'O';
        field[oy][ox] = '.';
      }
    }
  }

  // East
  for (let ox = field[0].length - 1; ox >= 0; ox -= 1) {
    for (let oy = 0; oy < field.length; oy += 1) {
      const cur = field[oy][ox];

      if (cur !== 'O') {
        continue;
      }

      let tx = ox;
      for (let x = ox + 1; x < field.length; x += 1) {
        if (field[oy][x] !== '.') {
          break;
        }

        tx = x;
      }

      if (tx !== ox) {
        field[oy][tx] = 'O';
        field[oy][ox] = '.';
      }
    }
  }
};

export const part2 = (input: string, cycles: number): number => {
  const field: Field = split(input).map((line) => line.split('') as Cell[]);

  const stringifyState = () => field.map((row) => row.join('')).join('-');
  const seenStates: Map<string, number> = new Map();

  let repeatOffset = 0;
  let repeatLength = 0;

  for (let n = 0; n < cycles + 1; n += 1) {
    const str = stringifyState();

    if (seenStates.has(str)) {
      repeatOffset = seenStates.get(str)!;
      repeatLength = n - seenStates.get(str)!;
      break;
    } else {
      seenStates.set(str, n);
    }

    runCycle(field);
  }
  const target = ((cycles - repeatOffset) % repeatLength) + repeatOffset;

  const finalStr = [...seenStates.entries()].find(([, n]) => n === target)![0];
  const finalState = finalStr.split('-').map((line) => line.split('') as Cell[]);

  return scoreRocks(finalState);
};
