import { split } from '@lib/processing';

type BinaryChar = '0' | '1';
type BinaryCounts = {
  0: number[];
  1: number[];
};

const getCounts = (lines: string[]) => {
  const counts: BinaryCounts = {
    0: new Array(lines[0].length).fill(0),
    1: new Array(lines[0].length).fill(0),
  };

  for (let col = 0; col < lines[0].length; col += 1) {
    lines.forEach((line) => {
      counts[line[col] as BinaryChar][col] += 1;
    });
  }

  return counts;
};

const compareDigits = (counts: BinaryCounts) => {
  const gammaDigits: BinaryChar[] = [];
  const epsilonDigits: BinaryChar[] = [];
  for (let col = 0; col < counts[0].length; col += 1) {
    if (counts[0][col] > counts[1][col]) {
      gammaDigits[col] = '0';
      epsilonDigits[col] = '1';
    } else {
      gammaDigits[col] = '1';
      epsilonDigits[col] = '0';
    }
  }

  return [gammaDigits, epsilonDigits];
};

/*
  Gamma = most common digit in each position
*/
export const a = (input: string) => {
  const lines = split(input);
  const counts = getCounts(lines);
  const [gammaDigits, epsilonDigits] = compareDigits(counts);

  const gamma = parseInt(gammaDigits.join(''), 2);
  const epsilon = parseInt(epsilonDigits.join(''), 2);

  return gamma * epsilon;
};

export const b = (input: string) => {
  const lines = split(input);

  let o2 = [...lines];
  let co2 = [...lines];

  for (let pos = 0; pos < lines[0].length; pos += 1) {
    if (o2.length > 1) {
      const counts = getCounts(o2);
      const [gammaDigits] = compareDigits(counts);
      o2 = o2.filter((line) => line[pos] === gammaDigits[pos]);
    }

    if (co2.length > 1) {
      const counts = getCounts(co2);
      const [, epsilonDigits] = compareDigits(counts);
      co2 = co2.filter((line) => line[pos] === epsilonDigits[pos]);
    }
  }

  const o2Rating = parseInt(o2.join(''), 2);
  const co2Rating = parseInt(co2.join(''), 2);

  return o2Rating * co2Rating;
};

/*
  Given a sorted list of binary strings
    For each position
      Determine the least or most common digit
      Take the subset matching that digit
      Repeat until only one string is left
*/
const binarySearchDigits = (lines: string[], takeMostCommon = false) => {
  let pos = 0;
  let min = 0;
  let max = lines.length - 1;

  while (min < max) {
    for (let i = min; i <= max; i += 1) {
      if (lines[i][pos] !== lines[i + 1][pos]) {
        const mid = i;

        // More 0s and we want the least, or less 0s and we want the most
        if ((mid - min) >= (max - mid) !== takeMostCommon) {
          max = mid;
        } else {
          min = mid + 1;
        }

        pos += 1;

        break;
      }
    }
  }

  return min;
};

export const bBinary = (input: string) => {
  const lines = split(input).sort();

  const o2min = binarySearchDigits(lines);
  const co2min = binarySearchDigits(lines, true);

  const o2Rating = parseInt(lines[o2min], 2);
  const co2Rating = parseInt(lines[co2min], 2);

  return o2Rating * co2Rating;
};
