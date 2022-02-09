import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2, part2StringFiltering } from '.';

const title = 'Alchemical Reaction';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['aA', 0],
        ['abBA', 0],
        ['abAB', 4],
        ['aabAAB', 6],
        ['dabAcCaCBAcCcaDA', 10],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 9386;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['dabAcCaCBAcCcaDA', 4],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 4876;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });

    describe('Solution (string filtering)', () => {
      const knownSolution = 4876;

      test(`${knownSolution}`, () => {
        const solution = part2StringFiltering(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
