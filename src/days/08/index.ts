/*
 0: 6    1: 2    2: 5    3: 5    4: 4
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

 5: 5    6: 6    7: 3    8: 7    9: 6
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/

import { split } from '../../utilities/processing';

const UNIQUE_LENGTHS: { [key: number]: number } = {
  2: 1,
  3: 7,
  4: 4,
  7: 8,
};

const DIGITS_BY_LENGTH = {
  7: [8],
  6: [0, 6, 9],
  5: [2, 3, 5],
  4: [4],
  3: [7],
  2: [1],
};

type DigitLength = 2 | 3 | 4 | 5 | 6 | 7;

type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

const contains = (a: Letter[], b: Letter[]) => b.every((char) => a.includes(char));

const decodeEntry = ({
  digits,
  output,
}: {
  digits: Letter[][],
  output: string[],
}): number => {
  const knownDigitsByValue: { [key: number]: Letter[] } = {};
  const knownValuesByDigit: Map<Letter[], number> = new Map();
  let knownValuesCount = 0;

  const addKnownDigit = (value: number, digit: Letter[]) => {
    knownDigitsByValue[value] = digit;
    knownValuesByDigit.set(digit, value);
    knownValuesCount += 1;
  };

  // Grab the easy cases first
  digits.forEach((digit: Letter[]) => {
    const valueFromUniqueLength = UNIQUE_LENGTHS[digit.length];

    if (valueFromUniqueLength) {
      addKnownDigit(valueFromUniqueLength, digit);
    }
  });

  let times = 0;

  while (times < 10 && knownValuesCount < 10) {
    digits.forEach((digit: Letter[]) => {
      if (knownValuesByDigit.has(digit)) { return; }

      const possible = DIGITS_BY_LENGTH[digit.length as DigitLength]
        .filter((d) => !knownDigitsByValue[d]);

      // console.dir({ digit, possible });

      if (possible.length === 1) {
        addKnownDigit(possible[0], digit);
        return;
      }

      if (digit.length === 6) {
        if ((knownDigitsByValue[5] && contains(digit, knownDigitsByValue[5]))) {
          if (knownDigitsByValue[1]) {
            if (contains(digit, knownDigitsByValue[1])) {
              addKnownDigit(9, digit);

              return;
            } else {
              addKnownDigit(6, digit);

              return;
            }
          }

          addKnownDigit(0, digit);

          return;
        }

        if ((knownDigitsByValue[7] && !contains(digit, knownDigitsByValue[7]))) {
          addKnownDigit(6, digit);

          return;
        }
      }

      if (digit.length === 5) {
        if (knownDigitsByValue[1] && contains(digit, knownDigitsByValue[1])) {
          addKnownDigit(3, digit);

          return;
        }

        if (knownDigitsByValue[6] || knownDigitsByValue[9]) {
          if (contains(knownDigitsByValue[6] || knownDigitsByValue[9], digit)) {
            addKnownDigit(5, digit);

            return;
          } else {
            addKnownDigit(2, digit);

            return;
          }
        }
      }
    });

    times += 1;
  }

  const valuesByString: { [key: string]: number } = {};
  knownValuesByDigit.forEach((value, digit) => { valuesByString[digit.join('')] = value; });

  const mappedOutput = output.map((digit) => valuesByString[digit]);

  // console.dir({ valuesByString, output, mappedOutput });
  return parseInt(mappedOutput.join(''), 10);
};

export const a = (input: string) => {
  const rawEntries = split(input);

  const entries = rawEntries.map((entry) => {
    const match = entry.match(/([^|]+) \| (.+)/) as string[];
    const [, rawDigits, rawOutput] = match;

    return {
      digits: rawDigits.split(' ').map((str) => str.split('').sort().join('')),
      output: rawOutput.split(' ').map((str) => str.split('').sort().join('')),
    };
  });

  let uniqueOutputDigits = 0;

  entries.forEach((entry) => {
    entry.output.forEach((outputDigit) => {
      if (UNIQUE_LENGTHS[outputDigit.length]) {
        uniqueOutputDigits += 1;
      }
    });
  });

  return uniqueOutputDigits;
};

export const b = (input: string) => {
  const rawEntries = split(input);

  const entries = rawEntries.map((entry) => {
    const match = entry.match(/([^|]+) \| (.+)/) as string[];
    const [, rawDigits, rawOutput] = match;

    const sortedDigits = rawDigits.split(' ').map((str) => str.split('').sort().join(''));
    const sortedOutput = rawOutput.split(' ').map((str) => str.split('').sort().join(''));

    const obj: { digits: Letter[][], output: string[] } = {
      digits: Array.from(new Set([...sortedDigits, ...sortedOutput])).map((digits) => digits.split('')) as Letter[][],
      output: sortedOutput,
    };

    return decodeEntry(obj);
  });

  return entries.reduce((acc, cur) => acc + cur, 0);
};
