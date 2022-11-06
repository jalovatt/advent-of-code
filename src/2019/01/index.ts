import { splitToNumber } from '@lib/processing';

const fuelRequired = (mass: number): number => {
  const fuel = ((mass / 3) >> 0) - 2;

  return fuel > 0 ? fuel : 0;
};

export const part1 = (input: string): number => {
  const parsed = splitToNumber(input, '\n');

  return parsed.reduce((acc, cur) => acc + fuelRequired(cur), 0);
};

export const part2 = (input: string): number => {
  const parsed = splitToNumber(input, '\n');

  return parsed.reduce((acc, cur) => {
    let total = 0;
    let mass = cur;

    do {
      mass = fuelRequired(mass);
      total += mass;
    } while (mass > 0);

    return acc + total;
  }, 0);
};
