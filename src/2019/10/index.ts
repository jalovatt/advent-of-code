import { split } from '@lib/processing';

enum Cell {
  Empty = '.',
  Asteroid = '#',
}

type Field = Cell[][];
type PointVisibilities = Map<number, Map<number, [number, number][]>>;

const parseInput = (input: string): Field => split(input, '\n')
  .map((line) => line.split('') as Cell[]);

// X0Y
const encodePoint = (x: number, y: number) => x * 100 + y;

const analyzeField = (field: Field): [PointVisibilities, [number, number]] => {
  /*
    srcPoint: {
      [angle]: [
        [destPoint, distance]
      ],
    },
  */

  const pointVisibilities: PointVisibilities = new Map();
  // point, count
  let max: [number, number] = [0, 0];

  for (let oy = 0; oy < field.length; oy += 1) {
    for (let ox = 0; ox < field[0].length; ox += 1) {
      if (field[oy][ox] !== Cell.Asteroid) {
        continue;
      }

      const o = encodePoint(ox, oy);
      const map = new Map();
      pointVisibilities.set(o, map);

      for (let ty = 0; ty < field.length; ty += 1) {
        for (let tx = 0; tx < field[0].length; tx += 1) {
          if ((ty === oy && tx === ox) || field[ty][tx] !== Cell.Asteroid) {
            continue;
          }

          const t = encodePoint(tx, ty);
          const dy = oy - ty;
          const dx = ox - tx;
          const angle = Math.atan2(dy, dx);
          const d = Math.abs(dy) + Math.abs(dx);

          if (!map.has(angle)) {
            map.set(angle, []);
          }

          map.get(angle)!.push([t, d]);
        }
      }

      max = (map.size > max[1]) ? [o, map.size] : max;
    }
  }

  return [pointVisibilities, max];
};

export const part1 = (input: string): number => {
  const field = parseInput(input);
  const [, [, count]] = analyzeField(field);

  return count;
};

export const part2 = (input: string): number => {
  const field = parseInput(input);
  const [visibilities, [o]] = analyzeField(field);

  const byAngle: [number, [number, number][]][] = (
    Array.from(visibilities.get(o)!.entries()).sort((a, b) => a[0] - b[0])
  );
  byAngle.forEach(([, targets]) => targets.sort((a, b) => a[1] - b[1]));

  const up = Math.atan2(11, 0);
  let index = byAngle.findIndex(([angle]) => angle >= up);

  let destroyed = 0;
  let target: [number, number] = [0, 0];

  while (destroyed < 200) {
    const arr = byAngle[index][1];
    if (arr.length) {
      target = arr.shift()!;
      destroyed += 1;
    }

    index = (index + 1) % byAngle.length;
  }

  return target[0];
};
