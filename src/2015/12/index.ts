const NUMERIC_CHARS = {
  '-': true,
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
};

const OPEN_CURLY = '{';
const CLOSE_CURLY = '}';

export const part1 = (input: string): number => {
  let sum = 0;
  let curNegative = false;
  let curNumber = 0;
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (c in NUMERIC_CHARS) {
      if (c === '-') {
        curNumber = 0;
        curNegative = true;
      } else {
        curNumber = (curNumber || 0) * 10 + parseInt(c, 10);
      }
    } else if (curNumber) {
      sum += curNegative ? -curNumber : curNumber;

      curNumber = 0;
      curNegative = false;
    }
  }

  return sum;
};

export const part2 = (input: string): number => {
  const sums: number[] = [0];

  let ignoreUntilDepth = null;
  let curNegative = false;
  let curNumber = 0;
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (c in NUMERIC_CHARS) {
      if (c === '-') {
        curNumber = 0;
        curNegative = true;
      } else {
        curNumber = (curNumber || 0) * 10 + parseInt(c, 10);
      }
    } else {
      if (curNumber) {
        const v = curNegative ? -curNumber : curNumber;
        sums[sums.length - 1] += v;

        curNumber = 0;
        curNegative = false;
      }

      if (c === CLOSE_CURLY) {
        const depthSum = sums.pop()!;

        if (ignoreUntilDepth === null) {
          sums[sums.length - 1] += depthSum;
        } else if (ignoreUntilDepth === sums.length) {
          ignoreUntilDepth = null;
        }
      } else if (c === OPEN_CURLY) {
        sums.push(0);
      // There are no other values starting with ':"r' in the input
      } else if (c === ':') {
        if (input[i + 1] === '"' && input[i + 2] === 'r') {
          const parentDepth = sums.length - 1;

          if (ignoreUntilDepth === null) {
            ignoreUntilDepth = parentDepth;
          }
        }
      }
    }
  }

  return sums[0];
};
