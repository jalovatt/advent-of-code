import { split } from '@lib/processing';

/*
  area = 2*l*w + 2*w*h + 2*h*l
         + the area of the smallest side.
*/
export const part1 = (input: string): number => {
  const presents = split(input).map((l) => l.split('x').map((n) => parseInt(n, 10)));

  let total = 0;
  for (let i = 0; i < presents.length; i += 1) {
    const [l, w, h] = presents[i];

    const sides = [l * w, w * h, h * l];

    for (let s = 0; s < sides.length; s += 1) {
      total += 2 * sides[s];
    }

    total += Math.min(...sides);
  }

  return total;
};

/*
  smallest face perimeter + l*w*h
*/
export const part2 = (input: string): number => {
  const presents = split(input).map((l) => l.split('x').map((n) => parseInt(n, 10)));

  let total = 0;
  for (let i = 0; i < presents.length; i += 1) {
    const [l, w, h] = presents[i];

    const perimeters = [2 * l + 2 * w, 2 * w + 2 * h, 2 * h + 2 * l];

    total += Math.min(...perimeters);
    total += l * w * h;
  }

  return total;
};
