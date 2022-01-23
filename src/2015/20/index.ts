import CircuitBreaker from '@lib/CircuitBreaker';

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];

export const isPrime = (n: number): boolean => {
  if (n === 1 || n === 2) { return true; }

  const l = Math.sqrt(n) >>> 0;
  for (let i = 0; i < primes.length; i += 1) {
    const p = primes[i];

    if (p > l) { return true; }
    if (n % p === 0) { return false; }
  }

  return true;
};

/*
  After 2 and 3, all primes are of the form 6k +- 1

  This function pushes into the global list when it finds a prime, so the next
  call to primeFactorize will have that one available.
*/
export const findNextPrime = (): number => {
  const base = primes[primes.length - 1];
  let cur = Math.ceil(base / 6) * 6;

  const breaker = new CircuitBreaker(10000000);

  while (true) {
    breaker.tick();
    const prev = cur - 1;

    if (prev !== primes[primes.length - 1] && isPrime(prev)) {
      primes.push(prev);
      return prev;
    }

    const next = cur + 1;

    if (isPrime(next)) {
      primes.push(next);
      return next;
    }

    cur += 6;
  }
};

/*
  TODO: Cache the smaller factorizations for each X as we find them so that,
  if we're factoring a larger number and get to X, we can just add those on.
*/
export const primeFactorize = (n: number): [number, number][] => {
  const count: Map<number, number> = new Map();

  let cur = n;
  const limit = Math.sqrt(n) >>> 0;

  let i = 0;
  while (cur > 1 && i < primes.length - 1) {
    const factor = primes[i];

    if (factor > 3 && factor > limit) {
      break;
    }

    const mod = cur % factor;
    if (!mod) {
      count.set(factor, (count.get(factor) || 0) + 1);
      cur /= factor;
    } else {
      i += 1;
    }
  }

  let factor = findNextPrime();

  // If we get to sqrt(n), this number is prime
  while (cur > 1 && factor <= limit) {
    const mod = cur % factor;

    if (!mod) {
      count.set(factor, (count.get(factor) || 0) + 1);
      cur /= factor;
    } else {
      factor = findNextPrime();
    }
  }

  return Array.from(count);
};

/*
  Sum of prime factors:
    x ^ a, y ^ b, z ^ c => [[x, a], [y, b], [z, c]]

  (x^(a+1) - 1) / (x - 1) * ...y... * ...z...
*/
export const sumPrimeFactors = (factors: [number, number][]): number => {
  let total = 1;

  for (let i = 0; i < factors.length; i += 1) {
    const x = factors[i][0];
    const a = factors[i][1];
    const xa = (x ** (a + 1) - 1) / (x - 1);

    total *= xa;
  }

  return total;
};

const getFactors = (n: number): number[] => {
  const factors: Set<number> = new Set([1, n]);

  const max = Math.ceil(Math.sqrt(n));

  for (let i = 2; i <= max; i += 1) {
    const cofactor = n / i;
    if (cofactor === (cofactor >>> 0)) {
      factors.add(i);
      factors.add(cofactor);
    }
  }

  return Array.from(factors);
};

/*
  Presents @ N = 10 * sum(x, 1, ...factors(N))
*/
export const part1 = (input: number | string): number => {
  const target = typeof input === 'number' ? input : parseInt(input, 10);

  /*
    Magic number to avoid values small enough that we know they aren't the
    solution; just based on how seeing how high I could go while still getting
    the right answer.
  */
  const start = Math.max((target / 44) >>> 0, 1);

  for (let i = start; i < target; i += 1) {
    const primeFactors = primeFactorize(i);

    const sum = sumPrimeFactors(primeFactors);

    if (10 * sum >= target) {
      return i;
    }
  }

  throw new Error('Could not solve');
};

export const part2 = (input: number | string): number => {
  const target = typeof input === 'number' ? input : parseInt(input, 10);
  const start = Math.max((target / 44) >>> 0, 1);

  for (let i = start; i < target; i += 1) {
    const factors = getFactors(i);

    /*
      It doesn't look like we can use the prime factors here, because each elf's
      original number is what determines whether we're adding them.
    */
    let sum = 0;
    for (let j = 0; j < factors.length; j += 1) {
      const f = factors[j];
      if (i <= (50 * f)) {
        sum += factors[j];
      }
    }

    if (11 * sum >= target) {
      return i;
    }
  }

  throw new Error('could not solve');
};
