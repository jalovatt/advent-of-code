import { split } from '@lib/processing';

export const part1 = (input: string): number => {
  const pairs = split(input);

  let total = 0;

  pairs.forEach((pair) => {
    const result = pair.split(/[-,]/);
    const [l1, l2, r1, r2] = result.map((n) => parseInt(n, 10));

    const contains = (l1 <= r1 && l2 >= r2) || (r1 <= l1 && r2 >= l2);

    if (contains) {
      total += 1;
    }
  });

  return total;
};

export const part2 = (input: string): number => {
  const pairs = split(input);

  let total = 0;

  pairs.forEach((pair) => {
    const result = pair.split(/[-,]/);
    const [l1, l2, r1, r2] = result.map((n) => parseInt(n, 10));

    const contains = (l1 <= r1 && r1 <= l2) || (r1 <= l1 && l1 <= r2);

    if (contains) {
      total += 1;
    }
  });

  return total;
};
