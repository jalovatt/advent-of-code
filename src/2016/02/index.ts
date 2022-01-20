import { split } from '@lib/processing';

type Pos = { y: number, x: number };
type Direction = 'R' | 'L' | 'U' | 'D';

const PAD = {
  1: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
  2: [
    [null, null, 1, null, null],
    [null, 2, 3, 4, null],
    [5, 6, 7, 8, 9],
    [null, 'A', 'B', 'C', null],
    [null, null, 'D', null, null],
  ],
} as const;

const P1_MAX_INDEX = 2;

const P2_BOUNDS = [
  [2, 2],
  [1, 3],
  [0, 4],
  [1, 3],
  [2, 2],
];

const move: Record<number, Record<Direction, (pos: Pos) => void>> = {
  1: {
    R: (pos) => { pos.x = Math.min(pos.x + 1, P1_MAX_INDEX); },
    L: (pos) => { pos.x = Math.max(pos.x - 1, 0); },
    U: (pos) => { pos.y = Math.max(pos.y - 1, 0); },
    D: (pos) => { pos.y = Math.min(pos.y + 1, P1_MAX_INDEX); },
  },
  2: {
    R: (pos) => { pos.x = Math.min(pos.x + 1, P2_BOUNDS[pos.y][1]); },
    L: (pos) => { pos.x = Math.max(pos.x - 1, P2_BOUNDS[pos.y][0]); },
    U: (pos) => { pos.y = Math.max(pos.y - 1, P2_BOUNDS[pos.x][0]); },
    D: (pos) => { pos.y = Math.min(pos.y + 1, P2_BOUNDS[pos.x][1]); },
  },
};

const solve = (input: string, part: 1 | 2 = 1): string => {
  const steps = split(input);

  const code: (number | string)[] = [];
  const pos: Pos = (part === 1)
    ? { y: 1, x: 1 }
    : { y: 2, x: 0 };

  for (let i = 0; i < steps.length; i += 1) {
    const s = steps[i];
    for (let c = 0; c < s.length; c += 1) {
      move[part][s[c] as Direction](pos);
    }

    code.push(PAD[part][pos.y]![pos.x]!);
  }

  return code.join('');
};

export const part1 = solve;
export const part2 = (input: string): string => solve(input, 2);
