import { split } from '@lib/processing';

export const getNextInSequence = (sequence: number[]): number => {
  const differences: number[] = [];
  let zeroes = 0;

  for (let i = 0; i < sequence.length - 1; i += 1) {
    const diff = sequence[i + 1] - sequence[i];
    differences.push(diff);

    if (diff === 0) {
      zeroes += 1;
    }
  }

  if (zeroes === differences.length) {
    return sequence[0];
  }

  return sequence[sequence.length - 1] + getNextInSequence(differences);
};

export const part1 = (input: string): number => split(input)
  .map((line) => line.split(' ').map((n) => parseInt(n, 10)))
  .reduce<number>((acc, cur) => acc + getNextInSequence(cur), 0);

export const part2 = (input: string): number => split(input)
  .map((line) => line.split(' ').map((n) => parseInt(n, 10)).reverse())
  .reduce<number>((acc, cur) => acc + getNextInSequence(cur), 0);
