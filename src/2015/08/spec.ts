/* eslint-disable no-useless-escape */
import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { getEscapedCount, getNetCount, part1, part2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

const example1 = `
""
"abc"
"aaa\\"aaa"
"\\x27"
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['""', 0],
        ['"abc"', 3],
        ['"aaa\\"aaa"', 7],
        ['"\\x27"', 1],
      ])('%p => %p', (given, expected) => {
        expect(getNetCount(given)).toEqual(expected);
      });

      test('example', () => {
        expect(part1(example1)).toEqual(12);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1371;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['""', 6],
        ['"abc"', 9],
        ['"aaa\\"aaa"', 16],
        ['"\\x27"', 11],
      ])('%p => %p', (given, expected) => {
        expect(getEscapedCount(given)).toEqual(expected);
      });

      test('example', () => {
        expect(part2(example1)).toEqual(19);
      });
    });

    describe('Solution', () => {
      const knownSolution = 2117;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
