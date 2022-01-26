import { split } from '@lib/processing';

type Range = [number, number];

export const part1 = (input: string): number => {
  const entries: Range[] = split(input).map((line) => (
    line.match(/\d+/g)!.map((n) => parseInt(n, 10)) as Range
  ));

  entries.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < entries.length - 1; i += 1) {
    if (entries[i + 1][0] > entries[i][1] + 1) {
      return entries[i][1] + 1;
    }
  }

  throw new Error('No gaps');
};

export const part2 = (input: string): number => {
  const entries: Range[] = split(input).map((line) => (
    line.match(/\d+/g)!.map((n) => parseInt(n, 10)) as Range
  ));

  entries.sort((a, b) => a[0] - b[0]);

  /*
    Verified by hand that there are no gaps at the beginning or end of the range
  */
  let count = 0;
  let max = entries[0][1];
  for (let i = 1; i < entries.length; i += 1) {
    if (entries[i][0] > max + 1) {
      count += entries[i][0] - max - 1;
    }

    max = Math.max(max, entries[i][1]);
  }

  return count;
};
