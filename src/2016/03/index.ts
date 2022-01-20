import { split } from '@lib/processing';

type Triangle = [number, number, number];

const countValidTriangles = (triangles: Triangle[]): number => triangles
  .reduce((acc, t) => {
    const sum = t[0] + t[1];
    const isValid = sum > t[2];

    if (isValid) { acc += 1; }

    return acc;
  }, 0);

export const part1 = (input: string): number => {
  const triangles = split(input).map((line) => {
    const [a, b, c] = line.match(/(\d+)/g)!;

    return [
      parseInt(a, 10),
      parseInt(b, 10),
      parseInt(c, 10),
    ].sort((l, r) => l - r) as Triangle;
  });

  return countValidTriangles(triangles);
};

export const part2 = (input: string): number => {
  const triangles: Triangle[] = [];

  const lines = split(input);

  for (let i = 0; i < lines.length; i += 3) {
    const [a1, a2, a3] = lines[i].match(/(\d+)/g)!;
    const [b1, b2, b3] = lines[i + 1].match(/(\d+)/g)!;
    const [c1, c2, c3] = lines[i + 2].match(/(\d+)/g)!;

    triangles.push(
      [
        parseInt(a1, 10),
        parseInt(b1, 10),
        parseInt(c1, 10),
      ].sort((l, r) => l - r) as Triangle,
      [
        parseInt(a2, 10),
        parseInt(b2, 10),
        parseInt(c2, 10),
      ].sort((l, r) => l - r) as Triangle,
      [
        parseInt(a3, 10),
        parseInt(b3, 10),
        parseInt(c3, 10),
      ].sort((l, r) => l - r) as Triangle,
    );
  }

  return countValidTriangles(triangles);
};
