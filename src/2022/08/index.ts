import { split, splitToNumber } from '@lib/processing';

export const part1 = (input: string): number => {
  const field = split(input).map((line) => splitToNumber(line, ''));

  const seen = new Set();
  let height = -1;

  const check = (x: number, y: number) => {
    if (field[y][x] > height) {
      height = field[y][x];

      // The input is only 99x99
      const k = x * 100 + y;

      if (!seen.has(k)) {
        seen.add(k);
      }
    }
  };

  for (let x = 0; x < field[0].length; x += 1) {
    // N -> S
    height = -1;
    for (let y = 0; y < field.length; y += 1) {
      check(x, y);
    }

    // S -> N
    height = -1;
    for (let y = field.length - 1; y >= 0; y -= 1) {
      check(x, y);
    }
  }

  for (let y = 0; y < field.length; y += 1) {
    // W -> E
    height = -1;
    for (let x = 0; x < field[0].length; x += 1) {
      check(x, y);
    }

    // E -> W
    height = -1;
    for (let x = field[0].length - 1; x >= 0; x -= 1) {
      check(x, y);
    }
  }

  return seen.size;
};

type Dir = 'N' | 'S' | 'E' | 'W';

export const part2 = (input: string): number => {
  const field = split(input).map((line) => splitToNumber(line, ''));

  let best = 0;

  for (let oy = 0; oy < field.length; oy += 1) {
    for (let ox = 0; ox < field[0].length; ox += 1) {
      const h = field[oy][ox];
      const visible: Record<Dir, number> = {
        N: 0,
        S: 0,
        E: 0,
        W: 0,
      };

      const check = (x: number, y: number, dir: Dir) => {
        visible[dir] += 1;

        return field[y][x] < h;
      };

      // S
      for (let y = oy + 1; y < field.length; y += 1) {
        if (!check(ox, y, 'S')) {
          break;
        }
      }

      // N
      for (let y = oy - 1; y >= 0; y -= 1) {
        if (!check(ox, y, 'N')) {
          break;
        }
      }

      // E
      for (let x = ox + 1; x < field[0].length; x += 1) {
        if (!check(x, oy, 'E')) {
          break;
        }
      }

      // W
      for (let x = ox - 1; x >= 0; x -= 1) {
        if (!check(x, oy, 'W')) {
          break;
        }
      }

      const total = visible.N * visible.S * visible.E * visible.W;

      if (total > best) {
        best = total;
      }
    }
  }

  return best;
};
