import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2, primeFactorize, sumPrimeFactors, isPrime, findNextPrime } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Prime factorization', () => {
    // Last hardcoded is 53
    // Must be run first because this function uses a file-level cache
    test('findNextPrime', () => {
      expect(findNextPrime()).toEqual(59);
      expect(findNextPrime()).toEqual(61);
      expect(findNextPrime()).toEqual(67);
      expect(findNextPrime()).toEqual(71);
    });

    describe('primeFactorize', () => {
      test.each([
        [144, [[2, 4], [3, 2]]],
        [1800, [[2, 3], [3, 2], [5, 2]]],
      ])('%p => %p', (given, expected) => {
        expect(primeFactorize(given)).toEqual(expected);
      });
    });

    describe('sumPrimeFactors', () => {
      test.each([
        [[[2, 4], [3, 2]], 403],
        [[[2, 3], [3, 2], [5, 2]], 6045],
      ] as [[number, number][], number][])('%p => %p', (given, expected) => {
        expect(sumPrimeFactors(given)).toEqual(expected);
      });
    });

    describe('isPrime', () => {
      test.each([
        [2, true],
        [64, false],
        [71, true],
        [72, false],
        [557, true],
      ])('%p => %p', (given, expected) => {
        expect(isPrime(given)).toEqual(expected);
      });
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [10, 1],
        [30, 2],
        [60, 4],
        [120, 6],
        [150, 8],
        [130, 8],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 786240;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 831600;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
