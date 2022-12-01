import { split, splitToNumber } from '@lib/processing';

const parseCalories = (input: string): number[] => {
  const elves = split(input, '\n\n');

  const calories = elves.map((elf) => {
    const counts = splitToNumber(elf, '\n');

    return counts.reduce((acc, cur) => acc + cur, 0);
  });

  calories.sort((a, b) => b - a);

  return calories;
};

export const part1 = (input: string): number => parseCalories(input)[0];
export const part2 = (input: string): number => parseCalories(input)
  .slice(0, 3).reduce((acc, cur) => acc + cur, 0);
