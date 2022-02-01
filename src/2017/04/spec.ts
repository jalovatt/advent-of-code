import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { validate, part1, part2 } from '.';

const title = 'High-Entropy Passphrases';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['aa bb cc dd ee', true],
        ['aa bb cc dd aa', false],
        ['aa bb cc dd aaa', true],
      ])('%p => %p', (given, expected) => {
        expect(validate(given, false)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 451;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 223;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
