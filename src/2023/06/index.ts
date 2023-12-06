import { split } from '@lib/processing';

/*
  Given T = N ms

  - Holding for X ms will give the boat v = X mm/ms
  - It will have T - X ms to move
  - It will travel X(T - X) mm

  This is a quadratic equation; the winning races are those for which:
  -X^2 + XT - D > 0
*/

const quadratic = (a: number, b: number, c: number): [number, number] => {
  const discriminant = (b * b) - (4 * a * c);

  return [
    (-b + Math.sqrt(discriminant)) / (2 * a),
    (-b - Math.sqrt(discriminant)) / (2 * a),
  ];
};

const calculateWays = (time: number, distance: number): number => {
  const intercepts = quadratic(-1, time, -distance).sort((a, b) => a - b);
  const snapped = [Math.ceil(intercepts[0]), Math.floor(intercepts[1])];

  // If an intercept is an integer, that time would only *equal* the distance
  if (snapped[0] === intercepts[0]) { snapped[0] += 1; }
  if (snapped[1] === intercepts[1]) { snapped[1] -= 1; }

  // +1 because it's an inclusive range
  return snapped[1] - snapped[0] + 1;
};

export const part1 = (input: string): number => {
  const [times, distances] = split(input).map((line) => line.split(/\s+/).slice(1).map((n) => parseInt(n, 10)));
  const races = times.map((t, i) => ({ time: t, distance: distances[i] }));

  let ways = 1;
  for (const r of races) {
    ways *= calculateWays(r.time, r.distance);
  }

  return ways;
};

export const part2 = (input: string): number => {
  const [time, distance] = split(input).map((line) => parseInt(line.split(/\s+/).slice(1).join(''), 10));
  return calculateWays(time, distance);
};
