import { split } from '@lib/processing';

type Point = [number, number];
type Direction = 'U' | 'D' | 'R' | 'L';
type Overlap = { pos: Point, distance: number };

const moves: { [key in Direction]: [number, number] } = {
  U: [0, 1],
  D: [0, -1],
  R: [1, 0],
  L: [-1, 0],
};

const run = (
  input: string,
  comparator: (shortest: Overlap, current: Overlap) => boolean,
): Overlap => {
  const visited: Map<number, Map<number, number>> = new Map([[0, new Map([[0, 0]])]]);
  let shortest: Overlap = {
    pos: [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    distance: Number.MAX_SAFE_INTEGER,
  };

  const visit = (
    pos: [number, number],
    distanceTravelled: number,
    isSecondLine: boolean,
  ): number | undefined | false => {
    if (isSecondLine) {
      return visited.get(pos[0])?.get(pos[1]);
    }

    if (!visited.has(pos[0])) {
      visited.set(pos[0], new Map());
    }

    visited.get(pos[0])!.set(pos[1], distanceTravelled);

    return false;
  };

  split(input).forEach((line, isSecondLine) => {
    const pos: Point = [0, 0];
    let distanceTravelled = 0;

    for (const [, dir, valueRaw] of line.matchAll(/([UDRL])(\d+)/g)) {
      const value = parseInt(valueRaw, 10);

      for (let i = 1; i <= value; i += 1) {
        pos[0] += moves[dir as Direction][0];
        pos[1] += moves[dir as Direction][1];
        distanceTravelled += 1;

        const overlapDistanceTravelled = visit(pos, distanceTravelled, !!isSecondLine);

        if (overlapDistanceTravelled) {
          const netDistanceTravelled = overlapDistanceTravelled + distanceTravelled;
          const current = { pos: [...pos] as Point, distance: netDistanceTravelled };

          if (comparator(shortest, current)) {
            shortest = current;
          }
        }
      }
    }
  });

  return shortest;
};

export const part1 = (input: string): number => {
  const { pos } = run(
    input,
    (shortest, current) => (
      (Math.abs(current.pos[0]) + Math.abs(current.pos[1]))
        < (Math.abs(shortest.pos[0]) + Math.abs(shortest.pos[1]))
    ),
  );

  return Math.abs(pos[0]) + Math.abs(pos[1]);
};

export const part2 = (input: string): number => run(
  input,
  (shortest: Overlap, current: Overlap) => current.distance < shortest.distance,
).distance;
