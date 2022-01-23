import CircuitBreaker from '@lib/CircuitBreaker';
import crypto from 'crypto';

export const getHash = (str: string): string => {
  const MD5 = crypto.createHash('md5');
  MD5.update(str);
  return MD5.digest('hex');
};

const getNextHash = (input: string, start: number): [string, number] => {
  let i = start;

  const breaker = new CircuitBreaker(50000000);
  while (true) {
    breaker.tick();
    i += 1;

    const hash = getHash(`${input}${i}`);

    let zeroCount = 0;
    for (let j = 0; j < 5; j += 1) {
      if (hash[j] === '0') {
        zeroCount += 1;
      }
    }

    if (zeroCount === 5) {
      return [hash, i];
    }
  }
};

export const part1 = (input: string): string => {
  const password = [];

  let start = 0;

  for (let i = 0; i < 8; i += 1) {
    const result = getNextHash(input, start);
    password.push(result[0][5]);

    start = result[1];
  }

  return password.join('');
};

export const part2 = (input: string): string => {
  const password = new Array(8).fill(' ');

  let count = 0;
  let start = 0;

  while (count < 8) {
    const result = getNextHash(input, start);
    const index = parseInt(result[0][5], 10);
    if (index < 8) {
      const value = result[0][6];

      if (password[index] === ' ') {
        password[index] = value;
        count += 1;
      }
    }

    start = result[1];
  }

  return password.join('');
};
