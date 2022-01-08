import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { lookAndSay, part1, part2 } from '.';

const title = 'Elves Look, Elves Say';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['1', '11'],
        ['11', '21'],
        ['21', '1211'],
        ['1211', '111221'],
        ['111221', '312211'],
      ])('%p => %p', (given, expected) => {
        expect(lookAndSay(given).join('')).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 360154;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 5103798;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
