import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

export const part1 = (input: string): number => {
  const values = split(input, /[^+-\d]+/).map((n) => parseInt(n, 10));

  return values.reduce((acc, cur) => acc + cur);
};

export const part2 = (input: string): number => {
  const values = split(input, /[^+-\d]+/).map((n) => parseInt(n, 10));

  const seen: Set<number> = new Set([0]);
  let current = 0;
  let i = 0;

  const breaker = new CircuitBreaker(1000000);
  while (!breaker.hasTripped) {
    breaker.tick();
    current += values[i];

    if (seen.has(current)) { break; }

    seen.add(current);

    i += 1;
    if (i === values.length) { i = 0; }
  }

  return current;
};
