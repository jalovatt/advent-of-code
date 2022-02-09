import { split } from '@lib/processing';

export const part1 = (input: string): number => {
  const lines = split(input);

  let twos = 0;
  let threes = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const l = lines[i];

    const seen: Record<string, number> = {};
    for (let j = 0; j < l.length; j += 1) {
      const c = l[j];

      if (seen[c] === undefined) { seen[c] = 0; }

      seen[c] += 1;
    }

    let isTwo = false;
    let isThree = false;

    const seenValues = Object.values(seen);
    for (let j = 0; j < seenValues.length; j += 1) {
      if (seenValues[j] === 2) {
        isTwo = true;
      } else if (seenValues[j] === 3) {
        isThree = true;
      }
    }

    if (isTwo) { twos += 1; }
    if (isThree) { threes += 1; }
  }

  return twos * threes;
};

export const part2 = (input: string): string => {
  const lines = split(input);

  for (let i = 0; i < lines.length - 1; i += 1) {
    jLoop:
    for (let j = i + 1; j < lines.length; j += 1) {
      let different = -1;

      for (let k = 0; k < lines[i].length; k += 1) {
        if (lines[i][k] !== lines[j][k]) {
          if (different >= 0) {
            continue jLoop;
          }

          different = k;
        }
      }

      if (different > -1) {
        const chars = lines[i].split('');
        chars.splice(different, 1);
        return chars.join('');
      }
    }
  }

  throw new Error('No pairs of lines were only 1 character different');
};
