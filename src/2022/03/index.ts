import { split } from '@lib/processing';

const priority = (c: string): number => {
  const v = c.charCodeAt(0);

  return (v > 96) ? v - 96 : v - 38;
};

export const part1 = (input: string): number => {
  const sacks = split(input);

  let total = 0;
  sacks.forEach((str: string) => {
    const leftChars = new Set();

    for (let i = 0; i < str.length / 2; i += 1) {
      leftChars.add(str[i]);
    }

    for (let i = Math.ceil(str.length / 2); i < str.length; i += 1) {
      if (leftChars.has(str[i])) {
        total += priority(str[i]);
        break;
      }
    }
  });

  return total;
};

export const part2 = (input: string): number => {
  const sacks = split(input);

  let total = 0;

  for (let i = 0; i < sacks.length; i += 3) {
    const first = new Set([...sacks[i]]);
    const second = new Set([...sacks[i + 1]].filter((c) => first.has(c)));
    const char = [...sacks[i + 2]].find((c) => second.has(c))!;

    total += priority(char);
  }

  return total;
};
