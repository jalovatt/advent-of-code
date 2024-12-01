import { split } from '@lib/processing';

const parseInput = (input: string): [number[], number[]] => {
  const l: number[] = [];
  const r: number[] = [];

  split(input).forEach((line) => {
    const [a, b] = line.split('   ');

    l.push(parseInt(a, 10));
    r.push(parseInt(b, 10));
  });

  return [l, r];
};

export const part1 = (input: string): number => {
  const [l, r] = parseInput(input);

  l.sort((a, b) => a - b);
  r.sort((a, b) => a - b);

  let sum = 0;

  for (let i = 0; i < l.length; i += 1) {
    sum += Math.abs(l[i] - r[i]);
  }

  return sum;
};

export const part2 = (input: string): number => {
  const [l, r] = parseInput(input);

  const rFrequencies = r.reduce<Record<number, number>>((acc, n) => {
    acc[n] = (acc[n] || 0) + 1;
    return acc;
  }, {});

  let sum = 0;

  for (let i = 0; i < l.length; i += 1) {
    const n = l[i];

    sum += n * (rFrequencies[n] || 0);
  }

  return sum;
};
