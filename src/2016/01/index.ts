import { split } from '@lib/processing';

type Pos = [number, number];
enum Direction { North, East, South, West }

const turn = (facing: Direction, turning: number): Direction => (facing + turning + 4) % 4;

const applyMove: { [key in Direction]: (pos: Pos, n: number) => Pos } = {
  [Direction.North]: (pos, n) => [pos[0], pos[1] - n],
  [Direction.East]: (pos, n) => [pos[0] + n, pos[1]],
  [Direction.South]: (pos, n) => [pos[0], pos[1] + n],
  [Direction.West]: (pos, n) => [pos[0] - n, pos[1]],
};

/*
  Reading comprehension: In part 2, "Locations you visit" includes each grid
  point we pass over, not just where each move ends.
*/
const solve = (input: string, breakOnRepeat = false): number => {
  const steps = split(input, ', ').map((step) => {
    const [, t, n] = step.match(/(\w)(\d+)/)!;

    return [t === 'L' ? -1 : 1, parseInt(n, 10)];
  });

  const seen: Set<string> = new Set(['0,0']);
  let currentlyFacing = Direction.North;
  let pos: Pos = [0, 0];

  mainLoop:
  for (let i = 0; i < steps.length; i += 1) {
    const [turning, n] = steps[i];

    currentlyFacing = turn(currentlyFacing, turning);
    for (let j = 0; j < n; j += 1) {
      pos = applyMove[currentlyFacing](pos, 1);
      const k = `${pos[0]},${pos[1]}`;

      if (breakOnRepeat && seen.has(k)) {
        break mainLoop;
      }

      seen.add(k);
    }
  }

  return Math.abs(pos[0]) + Math.abs(pos[1]);
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, true);
