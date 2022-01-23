import crypto from 'crypto';
import CircuitBreaker from '@lib/CircuitBreaker';

type CheckedHash = [string, string | null, number];

const getHash = (str: string, times = 1): string => {
  if (times === 0) { return str; }

  const MD5 = crypto.createHash('md5');
  MD5.update(str);
  return getHash(MD5.digest('hex'), times - 1);
};

class Ring<T> {
  arr: T[];
  head: number;

  constructor(length: number) {
    this.arr = new Array(length);
    this.head = 0;
  }

  push(v: T) {
    this.arr[this.head] = v;

    this.head += 1;
    if (this.head === this.arr.length) { this.head = 0; }
  }

  findAll(fn: (v: T) => T | null): T[] | null {
    let out = null;

    let i = this.head;

    const breaker = new CircuitBreaker(this.arr.length + 1);
    do {
      breaker.tick();

      if (this.arr[i] && fn(this.arr[i])) {
        if (!out) { out = []; }
        out.push(this.arr[i]);
      }

      i += 1;
      if (i === this.arr.length) { i = 0; }
    } while (i !== this.head);

    return out;
  }
}

const findTriplet = (str: string): string | null => {
  for (let i = 0; i < str.length - 2; i += 1) {
    if (
      str[i] === str[i + 1]
      && str[i] === str[i + 2]
    ) {
      return str[i];
    }
  }

  return null;
};

const getTripletMatcher = (char: string) => (arr: CheckedHash): CheckedHash | null => (
  arr[1] === char ? arr : null
);

const findQuintuplets = (str: string): string[] | null => {
  let out: string[] | null = null;

  for (let i = 0; i < str.length - 4; i += 1) {
    if (
      str[i] === str[i + 1]
      && str[i] === str[i + 2]
      && str[i] === str[i + 3]
      && str[i] === str[i + 4]
    ) {
      if (!out) { out = []; }
      out.push(str[i]);
    }
  }

  return out;
};

export const solve = (input: string, hashTimes = 1): number => {
  // Code, hash index
  const keys: Map<string, CheckedHash> = new Map();
  const buffer: Ring<CheckedHash> = new Ring(1000);

  const breaker = new CircuitBreaker(50000);

  let i = 0;
  // Going past 64 because the 64th time a quintuplet verifies a key may not be
  // the 64th key by index
  while (keys.size < 70) {
    breaker.tick();

    const hash = getHash(`${input}${i}`, hashTimes);
    const chars = findQuintuplets(hash);

    if (chars) {
      while (chars.length) {
        const char = chars.pop()!;
        const tripletMatcher = getTripletMatcher(char);

        const found = buffer.findAll(tripletMatcher);
        if (found) {
          while (found.length) {
            const f = found.pop()!;

            if (!keys.has(f[0])) {
              keys.set(f[0], f);
            }
          }
        }
      }
    }

    buffer.push([hash, findTriplet(hash), i]);

    i += 1;
  }

  const entries = Array.from(keys.values()).sort((a, b) => a[2] - b[2]);
  return entries[63][2];
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, 2017);
