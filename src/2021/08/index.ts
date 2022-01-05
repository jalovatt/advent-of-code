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

import { split } from '@lib/processing';
import circuitBreaker from '@lib/circuitBreaker';

// An object of { [key: K]: V } but it can be created empty with no fuss
type DynamicRecord<K extends string | number, V> = Partial<{ [key in K]: V }>;

type Value = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type DigitLength = 2 | 3 | 4 | 5 | 6 | 7;
type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type Digit = Letter[];

type ProcessedEntry = {
  digits: Digit[],
  output: string[],
};

const UNIQUE_LENGTHS: { [key: number]: Value } = {
  2: 1,
  3: 7,
  4: 4,
  7: 8,
};

const VALUES_BY_LENGTH: { [key: number]: Value[] } = {
  7: [8],
  6: [0, 6, 9],
  5: [2, 3, 5],
  4: [4],
  3: [7],
  2: [1],
};

const contains = (a: Digit, b: Digit) => b.every((char) => a.includes(char));

const decodeEntry = ({ digits, output }: ProcessedEntry): number => {
  const known: {
    values: DynamicRecord<Value, Digit>,
    digits: Map<Digit, Value>,
    count: number,
  } = { values: {}, digits: new Map(), count: 0 };

  const addKnown = (value: Value, digit: Digit) => {
    known.values[value] = digit;
    known.digits.set(digit, value);
    known.count += 1;
  };

  // Grab the uniques first
  digits.forEach((digit) => {
    const value = UNIQUE_LENGTHS[digit.length];

    if (value) {
      addKnown(value, digit);
    }
  });

  while (known.count < 10) {
    digits.forEach((digit) => {
      if (known.digits.has(digit)) { return undefined; }

      const possible = VALUES_BY_LENGTH[digit.length as DigitLength]
        .filter((d) => !known.values[d]);

      if (possible.length === 1) {
        return addKnown(possible[0], digit);
      }

      if (digit.length === 6) {
        // 9 + 6 are the only l=6 digits that are a superset of 5
        if ((known.values[5] && contains(digit, known.values[5]))) {
          // But only 9 is also a superset of 1
          if (known.values[1]) {
            return contains(digit, known.values[1])
              ? addKnown(9, digit)
              : addKnown(6, digit);
          }

          return addKnown(0, digit);
        }

        // 6 is the only l=6 digit that is not a superset of 7
        if ((known.values[7] && !contains(digit, known.values[7]))) {
          return addKnown(6, digit);
        }
      }

      if (digit.length === 5) {
        // 3 is the only l=5 digit that is a superset of 1
        if (known.values[1] && contains(digit, known.values[1])) {
          return addKnown(3, digit);
        }

        // 5 is a subset of both 9 and 6; 2 is neither
        const knownSuper = known.values[6] || known.values[5];
        if (knownSuper) {
          return contains(knownSuper as Digit, digit)
            ? addKnown(5, digit)
            : addKnown(2, digit);
        }
      }

      return undefined;
    });

    circuitBreaker(1000);
  }

  const valuesByString: { [key: string]: number } = {};
  known.digits.forEach((value, digit) => { valuesByString[digit.join('')] = value; });

  const decoded = output.map((digit) => valuesByString[digit]).join('');

  return parseInt(decoded, 10);
};

const normalizeEntry = (entry: string): { digits: string[], output: string[] } => {
  const match = entry.match(/([^|]+) \| (.+)/) as string[];
  const [, rawDigits, rawOutput] = match;

  return {
    digits: rawDigits.split(' ').map((str) => str.split('').sort().join('')),
    output: rawOutput.split(' ').map((str) => str.split('').sort().join('')),
  };
};

const dedupeArray = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const a = (input: string) => {
  const rawEntries = split(input);

  const entries = rawEntries.map(normalizeEntry);

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
    const normalized = normalizeEntry(entry);
    const digits = dedupeArray([...normalized.digits, ...normalized.output]);

    const obj: ProcessedEntry = {
      digits: digits.map((digit) => digit.split('')) as Digit[],
      output: normalized.output,
    };

    return decodeEntry(obj);
  });

  return entries.reduce((acc, cur) => acc + cur, 0);
};
