import { split } from '@lib/processing';

export const part1 = (input: string): number => {
  let sum = 0;

  split(input, '\n').forEach((row) => {
    const values = row.split(/\s+/);

    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;

    for (let i = 0; i < values.length; i += 1) {
      const v = parseInt(values[i], 10);

      if (v < min) { min = v; }
      if (v > max) { max = v; }
    }

    sum += Math.abs(max - min);
  });

  return sum;
};

export const part2 = (input: string): number => {
  const sheet = split(input, '\n').map((row) => row.split(/\s+/).map((n) => parseInt(n, 10)));

  let sum = 0;

  sheet.forEach((row) => {
    for (let i = 0; i < row.length - 1; i += 1) {
      for (let j = i + 1; j < row.length; j += 1) {
        const min = row[i] < row[j] ? row[i] : row[j];
        const max = min === row[i] ? row[j] : row[i];

        const dividend = max / min;

        if (dividend === (dividend >> 0)) {
          sum += dividend;
        }
      }
    }
  });

  return sum;
};
