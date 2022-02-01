import { split } from '@lib/processing';

export const validate = (phrase: string, anyOrder: boolean): boolean => {
  const seen: Set<string> = new Set();

  const words = split(phrase, ' ');

  for (let i = 0; i < words.length; i += 1) {
    const k = anyOrder ? words[i].split('').sort().join('') : words[i];
    if (seen.has(k)) { return false; }

    seen.add(k);
  }

  return true;
};

export const part1 = (input: string, anyOrder = false): number => {
  let count = 0;

  split(input).forEach((line) => { count += validate(line, anyOrder) ? 1 : 0; });

  return count;
};

export const part2 = (input: string): number => part1(input, true);
