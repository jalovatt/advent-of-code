import runTimes from '@lib/runTimes';

type Digit = string | number;
type Sequence = Digit[];

export const lookAndSay = (input: string | Sequence): Sequence => {
  const out: Sequence = [];
  let currentDigit: Digit = '';
  let currentDigitStart = 0;

  for (let i = 0; i < input.length; i += 1) {
    const d = input[i];

    // Specifically doing this because it lets us avoid explicitly converting to
    // a string or number when we push the digit
    // eslint-disable-next-line eqeqeq
    if (d != currentDigit) {
      if (currentDigit) {
        out.push((i - currentDigitStart), currentDigit);
      }

      currentDigit = d;
      currentDigitStart = i;
    }
  }

  out.push((input.length - currentDigitStart), currentDigit);

  return out;
};

export const part1 = (input: string): number => {
  let cur: string | Sequence = input;

  runTimes(40, () => { cur = lookAndSay(cur); });

  return cur.length;
};
export const part2 = (input: string): number => {
  let cur: string | Sequence = input;

  runTimes(50, () => { cur = lookAndSay(cur); });

  return cur.length;
};
