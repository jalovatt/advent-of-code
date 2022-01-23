import crypto from 'crypto';
import CircuitBreaker from '@lib/CircuitBreaker';

export const getHash = (str: string): string => {
  const MD5 = crypto.createHash('md5');
  MD5.update(str);
  return MD5.digest('hex');
};

const solve = (input: string, leadingZeroes = 5): number => {
  let i = 0;

  const breaker = new CircuitBreaker(5000000);
  while (true) {
    breaker.tick();
    i += 1;

    const hash = getHash(`${input}${i}`);

    let zeroCount = 0;
    for (let j = 0; j < leadingZeroes; j += 1) {
      if (hash[j] === '0') {
        zeroCount += 1;
      }
    }

    if (zeroCount === leadingZeroes) {
      break;
    }
  }

  return i;
};

export const part1 = (input: string): number => solve(input);
export const part2 = (input: string): number => solve(input, 6);
