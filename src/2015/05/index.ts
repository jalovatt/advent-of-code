import { split } from '@lib/processing';

enum Vowel { a, e, i, o, u }
type DisallowedPrefix = 'a' | 'c' | 'p' | 'x';
const disallowedPairs: Record<DisallowedPrefix, string> = { a: 'b', c: 'd', p: 'q', x: 'y' };

export const part1 = (input: string): number => {
  const lines = split(input);

  let count = 0;

  lineLoop:
  for (let i = 0; i < lines.length; i += 1) {
    let vowelsCount = 0;
    let hasDoubleLetter = false;

    if (lines[i][0] in Vowel) {
      vowelsCount += 1;
    }

    let lastLetter = lines[i][0];

    for (let j = 1; j < lines[i].length; j += 1) {
      const c = lines[i][j];

      if (lastLetter in disallowedPairs && disallowedPairs[lastLetter as DisallowedPrefix] === c) {
        continue lineLoop;
      }

      if (lines[i][j] in Vowel) {
        vowelsCount += 1;
      }

      if (c === lastLetter) {
        hasDoubleLetter = true;
      }

      lastLetter = c;
    }

    if (vowelsCount >= 3 && hasDoubleLetter) {
      count += 1;
    }
  }

  return count;
};

export const part2 = (input: string): number => {
  const lines = split(input);

  let count = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const seenPairs: Map<string, number> = new Map();

    let secondLastLetter = lines[i][0];
    let lastLetter = lines[i][1];

    seenPairs.set(`${secondLastLetter}${lastLetter}`, 1);

    let repeatedPair: [string, number, number] | undefined;
    let gapRepeatedLetter: [string, number] | undefined;

    for (let j = 2; j < lines[i].length; j += 1) {
      const c = lines[i][j];

      const pair = `${lastLetter}${c}`;
      const seen = seenPairs.get(pair);

      /*
        We can't just && here; we only want to set the pair index if it's the first
        occurrence, otherwise pairs that repeat more than once in a row will be a
        false negative, i.e. wwww in:

        rxexcbwhiywwwwnu
      */
      if (seen) {
        if (j - seen > 1) {
          repeatedPair = [pair, seen, j];
        }
      } else {
        seenPairs.set(pair, j);
      }

      if (secondLastLetter === c) {
        gapRepeatedLetter = [c, j - 2];
      }

      secondLastLetter = lastLetter;
      lastLetter = c;
    }

    if (repeatedPair && gapRepeatedLetter) {
      count += 1;
    }
  }

  return count;
};
