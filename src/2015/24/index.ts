import { split } from '@lib/processing';

const countBinaryLength = (n: number): number => {
  let cur = n;
  let count = 0;

  while (cur) {
    count += 1;
    cur >>>= 1;
  }

  return count;
};

// https://web.archive.org/web/20130731200134/http://hackersdelight.org/hdcodetxt/snoob.c.txt
const nextNumberSameOneBits = (x: number): number => {
  const smallest = x & -x;
  const ripple = x + smallest;
  let ones = x ^ ripple;
  ones = (ones >> 2) / smallest;
  return ripple | ones;
};

const sumCombination = (mask: number, items: number[], max: number): number => {
  let sum = 0;
  for (let j = 0; j < items.length; j += 1) {
    const has = ((mask >> j) & 1) === 1;

    if (has) {
      sum += items[j];

      if (sum > max) {
        return 0;
      }
    }
  }

  return sum;
};

type Combination = { values: number[], product: number };
const getCombination = (mask: number, items: number[]): Combination => {
  const values = [];
  let product = 1;

  for (let i = 0; i < items.length; i += 1) {
    const has = ((mask >> i) & 1) === 1;

    if (has) {
      values.push(items[i]);
      product *= items[i];
    }
  }

  return { values, product };
};

/*
  My original solution worked, but would have taken prohibitively long to get
  the answer for either part.

  Somewhere between Reddit and StackOverflow, I figured out that combinations can
  be represented by a bitmask of length equal to the list, which sped things up
  quite a bit over all of the arrays I was making and throwing out.
*/
export const solve = (input: string, numGroups = 3): number => {
  const items = split(input).map((n) => parseInt(n, 10)).reverse();

  // Just an assumption to limit our search space and reduce runtime
  const MAX_GROUP_SIZE = 6;

  const GROUP_SUM = items.reduce((a, b) => a + b) / numGroups;
  const MIN_GROUP_SIZE = Math.ceil(GROUP_SUM / items[0]);

  const validCombinations: Combination[] = [];

  for (let l = MIN_GROUP_SIZE; l <= MAX_GROUP_SIZE; l += 1) {
    let n = parseInt('1'.repeat(l), 2);

    while (countBinaryLength(n) <= items.length) {
      /*
        Doing the combinations in two passes so we don't waste time making arrays
        for the invalid ones.
      */
      if (sumCombination(n, items, GROUP_SUM) === GROUP_SUM) {
        validCombinations.push(getCombination(n, items));
      }

      n = nextNumberSameOneBits(n);
    }
  }

  validCombinations.sort((a, b) => {
    if (a.values.length !== b.values.length) { return a.values.length - b.values.length; }
    return a.product - b.product;
  });

  return validCombinations[0].product;
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, 4);
