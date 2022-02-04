const FACTORS = [16807, 48271];
const MOD = 2147483647;

const SIXTEEN_BITS = (1 << 16) - 1;
const compare = (a: number, b: number): boolean => (
  (a & SIXTEEN_BITS) === (b & SIXTEEN_BITS)
);

export const part1 = (input: string): number => {
  const generators = input.match(/\d+/g)!.map((n) => parseInt(n, 10));

  let count = 0;
  let times = 40000000;
  while (times) {
    generators[0] = (generators[0] * FACTORS[0]) % MOD;
    generators[1] = (generators[1] * FACTORS[1]) % MOD;

    if (compare(generators[0], generators[1])) {
      count += 1;
    }

    times -= 1;
  }

  return count;
};

export const part2 = (input: string): number => {
  const generators = input.match(/\d+/g)!.map((n) => parseInt(n, 10));

  const values: [number[], number[]] = [[], []];

  const PAIR_COUNT = 5000000;
  while (values[0].length < PAIR_COUNT || values[1].length < PAIR_COUNT) {
    generators[0] = (generators[0] * FACTORS[0]) % MOD;
    if ((generators[0] & 0b11) === 0) {
      values[0].push(generators[0]);
    }

    generators[1] = (generators[1] * FACTORS[1]) % MOD;
    if ((generators[1] & 0b111) === 0) {
      values[1].push(generators[1]);
    }
  }

  let count = 0;
  const max = Math.max(values[0].length, values[1].length);
  for (let i = 0; i < max; i += 1) {
    if (values[0][i] && values[1][i] && compare(values[0][i], values[1][i])) {
      count += 1;
    }
  }
  return count;
};
