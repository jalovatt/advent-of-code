import { split } from '../../utilities/processing';

const getCounts = (lines) => {
  const count = {
    0: new Array(lines[0].length).fill(0),
    1: new Array(lines[0].length).fill(0),
  };

  for (let col = 0; col < lines[0].length; col += 1) {
    lines.forEach((line) => {
      count[line[col]][col] += 1;
    })
  }

  return count;
};

const compareDigits = (counts) => {
  const gammaDigits = [];
  const epsilonDigits = [];
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
}

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
