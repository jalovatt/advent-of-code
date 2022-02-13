import { split } from '@lib/processing';

const getState = (center: number, field: Map<number, number>): number => {
  let s = 0;
  for (let i = center - 2; i <= center + 2; i += 1) {
    s <<= 1;

    if (field.get(i) === 1) {
      s += 1;
    }
  }

  return s;
};

export const run = (input: string, generations: number): number => {
  const [initialRaw, rulesRaw] = split(input, '\n\n');

  const fields: [Map<number, number>, Map<number, number>] = [
    new Map(initialRaw.match(/: (.+)$/)![1].split('').map((c, i) => [i, (c === '#' ? 1 : 0)])),
    new Map(),
  ];

  let active = 1;

  const rules: Record<number, number> = {};
  split(rulesRaw).forEach((line) => {
    const matches = line.match(/[.#]/g)!;
    const next = matches.pop();

    const map: Map<number, number> = new Map(matches.map((n, i) => [i, ((n === '#') ? 1 : 0)]));

    const k = getState(2, map);

    rules[k] = (next === '#') ? 1 : 0;
  });

  const getNextState = (start: number, map: Map<number, number>): number => (
    rules[getState(start, map)] || 0
  );

  let min = 0;
  let max = fields[0].size - 1;

  let lastSum = 0;
  let lastDiff = 0;

  let g = 0;
  while (g < generations) {
    const prev = fields[1 - active];

    let sum = 0;

    const next = fields[active];

    for (let i = min; i <= max; i += 1) {
      const v = getNextState(i, prev);
      if (v) { sum += i; }
      next.set(i, v);
    }

    const leftIndex = min - 1;
    const nextLeft = getNextState(leftIndex, prev);

    if (nextLeft) {
      sum += leftIndex;
      next.set(leftIndex, 1);
      min -= 1;
    }

    const rightIndex = max + 1;
    const nextRight = getNextState(rightIndex, prev);
    if (nextRight) {
      sum += rightIndex;
      next.set(rightIndex, 1);
      max += 1;
    }

    active = 1 - active;
    g += 1;

    const diff = sum - lastSum;
    if (diff === lastDiff) {
      return sum + (generations - g) * diff;
    }

    lastSum = sum;
    lastDiff = diff;
  }

  return lastSum;
};

export const part1 = (input: string) => run(input, 20);
export const part2 = (input: string) => run(input, 50000000000);
