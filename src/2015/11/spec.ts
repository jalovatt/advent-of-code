import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { parseInput, validate, part1, part2 } from '.';

const title = 'Corporate Policy';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Validation', () => {
      test.each([
        ['hijklmmn', 1],
        ['abbceffg', false],
        ['abbcegjk', false],
        ['abcdffaa', true],
        ['ghjaabcc', true],
        ['vzbyyzaa', false],
      ])('%p => %p', (given, expected) => {
        expect(validate(parseInput(given))).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        ['abcdefgh', 'abcdffaa'],
        ['ghijklmn', 'ghjaabcc'],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 'vzbxxyzz';

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 'vzcaabcc';

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
