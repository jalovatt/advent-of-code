import { split } from '@lib/processing';

type Left = 'A' | 'B' | 'C';
type Right = 'X' | 'Y' | 'Z';

enum Outcome {
  Loss = 0,
  Draw = 3,
  Win = 6,
}

enum Shape {
  Rock = 1,
  Paper,
  Scissors,
}

const shapes = {
  X: Shape.Rock,
  Y: Shape.Paper,
  Z: Shape.Scissors,
};

const beats: Record<Left, Right> & Record<Right, Left> = {
  A: 'Y',
  B: 'Z',
  C: 'X',
  X: 'C',
  Y: 'A',
  Z: 'B',
};

const loses: Record<Left, Right> = {
  A: 'Z',
  B: 'X',
  C: 'Y',
};

const equal: Record<Left, Right> & Record<Right, Left> = {
  A: 'X',
  B: 'Y',
  C: 'Z',
  X: 'A',
  Y: 'B',
  Z: 'C',
};

const expected = {
  X: Outcome.Loss,
  Y: Outcome.Draw,
  Z: Outcome.Win,
};

const resolveRound = (a: Left, b: Right): number => (
  (equal[b] === a && Outcome.Draw)
  || (beats[b] === a && Outcome.Win)
  || Outcome.Loss
);

const chooseShape = (a: Left, must: Outcome): Right => (
  (must === Outcome.Loss && loses[a])
  || (must === Outcome.Draw && equal[a])
  || beats[a]
);

export const part1 = (input: string): number => split(input)
  .reduce((acc, cur) => {
    const [, a, b] = cur.match(/(\w) (\w)/) as [any, Left, Right];

    const outcome = resolveRound(a, b);

    return acc + outcome + shapes[b];
  }, 0);

export const part2 = (input: string): number => split(input)
  .reduce((acc, cur) => {
    const [, a, b] = cur.match(/(\w) (\w)/) as [any, Left, Right];

    const choice = chooseShape(a, expected[b]);
    const outcome = resolveRound(a, choice);

    return acc + outcome + shapes[choice];
  }, 0);
