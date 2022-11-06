import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2, validate1, validate2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['111111', true],
        ['223450', false],
        ['123789', false],
      ])('%p => %p', (given, expected) => {
        expect(validate1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 475;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['112233', true],
        ['123444', false],
        ['111122', true],
      ])('%p => %p', (given, expected) => {
        expect(validate2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 297;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
