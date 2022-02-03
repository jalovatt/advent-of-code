import { split } from '@lib/processing';

type HexPos = [number, number, number];
type Move = 'n' | 'ne' | 'se' | 's' | 'sw' | 'nw';
const moves: Record<Move, HexPos> = {
  n: [0, -1, 1],
  ne: [1, -1, 0],
  se: [1, 0, -1],
  s: [0, 1, -1],
  sw: [-1, 1, 0],
  nw: [-1, 0, 1],
};

const hexMagnitude = (pos: HexPos): number => (
  (Math.abs(pos[0]) + Math.abs(pos[1]) + Math.abs(pos[2])) / 2
);

export const part1 = (input: string, wantFurthest = false): number => {
  const steps = split(input, ',') as Move[];

  const pos: HexPos = [0, 0, 0];
  let furthestMagnitude = 0;

  steps.forEach((s) => {
    pos[0] += moves[s][0];
    pos[1] += moves[s][1];
    pos[2] += moves[s][2];

    const m = hexMagnitude(pos);
    if (m > furthestMagnitude) {
      furthestMagnitude = m;
    }
  });

  return wantFurthest ? furthestMagnitude : hexMagnitude(pos);
};

export const part2 = (input: string): number => part1(input, true);
