import circuitBreaker from '@lib/circuitBreaker';
import { split } from '@lib/processing';

const setBit = (state: number, i: number): number => ((1 << i) | state);

const solve = (input: string, total: number): number[] => {
  const sizes = split(input).map((n) => parseInt(n, 10));

  const stateCapacities: Record<number, number> = { 0: 0 };
  const solutions = [];
  const toCheck = [0];
  while (toCheck.length) {
    circuitBreaker(1000000);
    const cur = toCheck.pop()!;

    for (let i = 0; i < sizes.length; i += 1) {
      const next = setBit(cur, i);

      if (stateCapacities[next]) { continue; }

      const cap = stateCapacities[cur] + sizes[i];
      stateCapacities[next] = cap;

      if (cap < total) {
        toCheck.push(next);
      } else if (cap === total) {
        solutions.push(next);
      }
    }
  }

  return solutions;
};

export const countActiveBits = (n: number): number => {
  let cur = n;
  let count = 0;

  while (cur) {
    if (cur & 1) { count += 1; }
    cur >>>= 1;
  }

  return count;
};

export const part1 = (input: string, total: number): number => solve(input, total).length;
export const part2 = (input: string, total: number): number => {
  const solutions = solve(input, total);

  let min = Number.MAX_SAFE_INTEGER;
  let minCount = 0;

  for (let i = 0; i < solutions.length; i += 1) {
    const l = countActiveBits(solutions[i]);

    if (l < min) {
      min = l;
      minCount = 1;
    } else if (l === min) {
      minCount += 1;
    }
  }

  return minCount;
};
