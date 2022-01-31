import { split } from '@lib/processing';

export const part1 = (input: string): number => {
  const digits = split(input, '').map((n) => parseInt(n, 10));

  let sum = 0;

  for (let i = 0; i < digits.length - 1; i += 1) {
    if (digits[i] === digits[i + 1]) {
      sum += digits[i];
    }
  }

  if (digits[digits.length - 1] === digits[0]) {
    sum += digits[0];
  }

  return sum;
};

export const part2 = (input: string): number => {
  const digits = split(input, '').map((n) => parseInt(n, 10));

  const HALF = digits.length / 2;
  const getHalfwayIndex = (n: number) => (n + HALF) % digits.length;

  let sum = 0;

  for (let i = 0; i < digits.length; i += 1) {
    if (digits[i] === digits[getHalfwayIndex(i)]) {
      sum += digits[i];
    }
  }

  return sum;
};
