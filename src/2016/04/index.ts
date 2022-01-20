import { split } from '@lib/processing';

const LETTERS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
const LETTERS_SET = new Set(LETTERS);

export const validate = (str: string): number | false => {
  const letterCounts: Record<string, number> = {};

  const [, name, id, checksum] = str.match(/([\w-]+)-(\d+)\[(\w+)\]/)!;

  for (let i = 0; i < name.length; i += 1) {
    const c = name[i];

    if (LETTERS_SET.has(c)) {
      letterCounts[c] = (letterCounts[c] || 0) + 1;
    }
  }

  const countEntries: [string, number][] = [];
  for (let i = 0; i < LETTERS.length; i += 1) {
    const l = LETTERS[i];

    if (letterCounts[l]) {
      countEntries.push([l, letterCounts[l]]);
    }
  }

  const sortedEntries = countEntries.sort((a, b) => {
    if (a[1] !== b[1]) { return b[1] - a[1]; }
    return a[0].charCodeAt(0) - b[0].charCodeAt(0);
  }).slice(0, 5)
    .map((e) => e[0])
    .join('');

  for (let i = 0; i < checksum.length; i += 1) {
    if (sortedEntries[i] !== checksum[i]) {
      return false;
    }
  }

  return parseInt(id, 10);
};

export const decrypt = (str: string): string => {
  const [, name, id] = str.match(/([\w-]+)-(\d+)/)!;

  const shift = parseInt(id, 10);

  const out = [];

  for (let i = 0; i < name.length; i += 1) {
    const c = name[i];

    if (c === '-') {
      out.push(' ');
    } else {
      const charCode = c.charCodeAt(0) - 97;
      const shifted = (charCode + shift) % 26;
      const char = String.fromCharCode(shifted + 97);

      out.push(char);
    }
  }

  return out.join('');
};

export const part1 = (input: string): number => {
  const lines = split(input);

  let sum = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const result = validate(lines[i]);

    if (result) {
      sum += result;
    }
  }

  return sum;
};

export const part2 = (input: string): number => {
  const lines = split(input);

  for (let i = 0; i < lines.length; i += 1) {
    const result = validate(lines[i]);
    if (!result) { continue; }

    if (decrypt(lines[i]).includes('north')) {
      return result;
    }
  }

  throw new Error('Could not find target room');
};
