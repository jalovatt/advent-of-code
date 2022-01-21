import { split } from '@lib/processing';

export const validate1 = (str: string): number | false => {
  let hasAbba: number | false = false;
  let inParens = false;

  for (let i = 0; i < str.length - 3; i += 1) {
    if (str[i] === '[') { inParens = true; continue; }
    if (str[i] === ']') { inParens = false; continue; }

    const isAbba = str[i] === str[i + 3]
      && str[i + 1] === str[i + 2]
      && str[i] !== str[i + 2];

    if (isAbba) {
      if (inParens) { return false; }
      hasAbba = i;
    }
  }

  return hasAbba;
};

export const part1 = (input: string): number => {
  const lines = split(input);

  let count = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (validate1(lines[i]) !== false) { count += 1; }
  }

  return count;
};

export const validate2 = (str: string): number | false => {
  const aba: Record<string, Map<string, number>> = {};
  const bab: Record<string, Map<string, number>> = {};

  let inParens = false;

  for (let i = 0; i < str.length - 2; i += 1) {
    if (str[i] === '[') { inParens = true; continue; }
    if (str[i] === ']') { inParens = false; continue; }
    if (!(str[i] === str[i + 2] && str[i] !== str[i + 1])) { continue; }

    let a = str[i];
    let b = str[i + 1];
    let src = aba;
    let dest = bab;

    if (inParens) {
      let temp: any = a;
      a = b;
      b = temp;

      temp = src;
      src = dest;
      dest = temp;
    }

    const match = src[b]?.get(a);

    if (match !== undefined) {
      return i;
    }

    if (!dest[b]) {
      dest[b] = new Map();
    }

    dest[b].set(a, i);
  }

  return false;
};

export const part2 = (input: string): number => {
  const lines = split(input);

  let count = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (validate2(lines[i]) !== false) { count += 1; }
  }

  return count;
};
