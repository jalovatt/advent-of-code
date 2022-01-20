import { splitToNumber } from '@lib/processing';

const FIRST = 20151125;
const TIMES = 252533;
const MOD = 33554393;

/*
  Faster way to solve x = (base^exp) % mod, since large exponents can be very
  slow.

  https://en.wikipedia.org/wiki/Modular_exponentiation#Implementation_in_Lua
*/
const binaryModExp = (base: number, exp: number, mod: number): number => {
  base %= mod;
  let remainder = 1;

  while (exp > 0) {
    if (exp % 2 === 1) {
      remainder = (remainder * base) % mod;
    }
    base = (base * base) % mod;
    exp >>>= 1;
  }

  return remainder;
};

export const nthInSequence = (n: number): number => {
  const remainder = binaryModExp(TIMES, n - 1, MOD);

  return (FIRST * remainder) % MOD;
};

export const part1 = (input: string): number => {
  const [row, col] = splitToNumber(input, ',');

  const triangleCol = col + row - 1;
  const triangleNum = (triangleCol * (triangleCol + 1)) / 2;
  const targetNum = triangleNum - (row - 1);

  return nthInSequence(targetNum);
};
