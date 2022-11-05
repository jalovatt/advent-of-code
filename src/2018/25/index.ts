import { split, splitToNumber } from '@lib/processing';

type Point4 = {
  x: number,
  y: number,
  z: number,
  t: number,
};

type Constellation = Point4[];

const manhattan4 = (a: Point4, b: Point4): number => (
  Math.abs(a.x - b.x)
  + Math.abs(a.y - b.y)
  + Math.abs(a.z - b.z)
  + Math.abs(a.t - b.t)
);

const parseInput = (input: string): Point4[] => split(input)
  .map((line) => {
    const [x, y, z, t] = splitToNumber(line, ',');

    return { x, y, z, t };
  });

export const part1 = (input: string): number => {
  const points = parseInput(input);

  const constellations: Constellation[] = [[points[0]]];

  points.forEach((p) => {
    const inRange: number[] = [];
    constellations.forEach((c, ci) => {
      for (const cp of c) {
        if (manhattan4(p, cp) <= 3) {
          inRange.push(ci);
          break;
        }
      }
    });

    if (inRange.length === 1) {
      const target = constellations[inRange[0]];
      target.push(p);
    } else if (inRange.length > 1) {
      const base = constellations[inRange.shift()!];

      inRange.sort((a, b) => b - a);
      inRange.forEach((ci) => {
        const [spliced] = constellations.splice(ci, 1);
        base.push(...spliced, p);
      });
    } else {
      constellations.push([p]);
    }
  });

  return constellations.length;
};
