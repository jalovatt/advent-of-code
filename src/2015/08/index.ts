import { split } from '@lib/processing';

export const getNetCount = (str: string): number => {
  let count = 0;

  let escapeAt: number | null = null;
  for (let i = 1; i < str.length - 1; i += 1) {
    const c = str[i];

    if (!escapeAt) {
      if (c === '\\') {
        escapeAt = i;
      } else {
        count += 1;
      }
    } else if (c === '\\' || c === '"' || i - escapeAt === 3) {
      count += 1;
      escapeAt = null;
    }
  }

  return count;
};

export const getEscapedCount = (str: string): number => {
  let count = 6;

  for (let i = 1; i < str.length - 1; i += 1) {
    count += 1;

    if (str[i] === '\\' || str[i] === '"') {
      count += 1;
    }
  }

  return count;
};

export const part1 = (input: string): number => {
  const lines = split(input);

  let rawCount = 0;
  let netCount = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const l = lines[i];
    rawCount += l.length;
    netCount += getNetCount(l);
  }

  return rawCount - netCount;
};

export const part2 = (input: string): number => {
  const lines = split(input);

  let rawCount = 0;
  let escapedCount = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const l = lines[i];
    rawCount += l.length;
    escapedCount += getEscapedCount(l);
  }

  return escapedCount - rawCount;
};
