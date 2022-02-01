import { splitToNumber } from '@lib/processing';

export const part1 = (input: string): number => {
  const offsets = splitToNumber(input);

  let pos = 0;
  let steps = 0;

  while (pos >= 0 && pos < offsets.length) {
    const i = pos;
    pos += offsets[i];
    offsets[i] += 1;
    steps += 1;
  }

  return steps;
};

export const part2 = (input: string): number => {
  const offsets = splitToNumber(input);

  let pos = 0;
  let steps = 0;

  while (pos >= 0 && pos < offsets.length) {
    const i = pos;
    pos += offsets[i];

    offsets[i] += (offsets[i] < 3) ? 1 : -1;
    steps += 1;
  }

  return steps;
};
