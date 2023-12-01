import { split } from '@lib/processing';

const getNumericDigit = (line: string, index: number) => {
  const code = line.charCodeAt(index);
  return code >= 48 && code <= 57 && parseInt(line[index], 10);
};

const DigitStringEntries: Array<[number, Array<string>]> = [
  [1, ['o', 'n', 'e']],
  [2, ['t', 'w', 'o']],
  [3, ['t', 'h', 'r', 'e', 'e']],
  [4, ['f', 'o', 'u', 'r']],
  [5, ['f', 'i', 'v', 'e']],
  [6, ['s', 'i', 'x']],
  [7, ['s', 'e', 'v', 'e', 'n']],
  [8, ['e', 'i', 'g', 'h', 't']],
  [9, ['n', 'i', 'n', 'e']],
];

const getStringDigit = (line: string, index: number) => {
  const result = DigitStringEntries.find(([, chars]) => (
    chars.every((c, i) => line[index + i] === c)
  ));

  return result?.[0] ?? false;
};

export const part1 = (input: string): number => {
  const lines = split(input, '\n');
  const values = lines.map((line) => {
    let v = 0;

    for (let i = 0; i < line.length; i += 1) {
      const digit = getNumericDigit(line, i);

      if (digit) {
        v = digit;
        break;
      }
    }

    v *= 10;

    for (let i = line.length - 1; i >= 0; i -= 1) {
      const digit = getNumericDigit(line, i);

      if (digit) {
        v += digit;
        break;
      }
    }

    return v;
  });

  return values.reduce((acc, cur) => acc + cur);
};

export const part2 = (input: string): number => {
  const lines = split(input, '\n');
  const values = lines.map((line) => {
    let v = 0;

    for (let i = 0; i < line.length; i += 1) {
      const digit = getNumericDigit(line, i) || getStringDigit(line, i);

      if (digit) {
        v = digit;
        break;
      }
    }

    v *= 10;

    for (let i = line.length - 1; i >= 0; i -= 1) {
      const digit = getNumericDigit(line, i) || getStringDigit(line, i);

      if (digit) {
        v += digit;
        break;
      }
    }

    return v;
  });

  return values.reduce((acc, cur) => acc + cur);
};
