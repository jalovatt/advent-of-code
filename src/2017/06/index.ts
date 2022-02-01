import CircuitBreaker from '@lib/CircuitBreaker';
import { splitToNumber } from '@lib/processing';

const getKey = (arr: any): string => arr.join(',');

export const part1 = (input: string, findCycleLength = false): number => {
  const banks = splitToNumber(input, /\s+/);

  const breaker = new CircuitBreaker(100000);

  let steps = 0;
  const seen: Set<string> = new Set([getKey(banks)]);
  const target: [string?, number?] = [];

  while (true) {
    breaker.tick();

    let max = 0;
    for (let i = 1; i < banks.length; i += 1) {
      if (banks[i] > banks[max]) {
        max = i;
      }
    }

    let v = banks[max];

    banks[max] = 0;

    let i = (max + 1) % banks.length;
    while (v) {
      banks[i] += 1;
      v -= 1;

      i += 1;
      if (i === banks.length) { i = 0; }
    }

    steps += 1;
    const k = getKey(banks);

    if (seen.has(k)) {
      if (!findCycleLength) { return steps; }

      if (!target[0]) {
        target[0] = k;
        target[1] = steps;
      } else if (k === target[0]) {
        return steps - target[1]!;
      }
    }

    seen.add(k);
  }
};

export const part2 = (input: string): number => part1(input, true);
