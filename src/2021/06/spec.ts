import loadText from '@lib/loadText';
import { a, aFishonacci, b } from '.';

const title = 'Lanternfish';

const input = loadText('input.txt');

const example1 = `
3,4,3,1,2
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      xtest.each([
        [example1, 5934],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });

      // For checking against fishonacci
      test('1', () => {
        expect(a('1')).toEqual(1401);
      });
    });

    describe('Solution', () => {
      const knownSolution = 353079;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 1 (Fishonacci)', () => {
    describe('Tests', () => {
      test.each([
        [example1, 5934],
      ])('%p => %p', (given, expected) => {
        expect(aFishonacci(given)).toEqual(expected);
      });

      test('1', () => {
        expect(aFishonacci('1')).toEqual(1401);
      });
    });

    describe('Solution', () => {
      const knownSolution = 353079;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 26984457539],
      ])('%p => %p', (given, expected) => {
        expect(b(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1605400130036;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
