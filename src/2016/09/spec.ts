import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Explosives in Cyberspace';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['ADVENT', 6],
        ['A(1x5)BC', 7],
        ['(3x3)XYZ', 9],
        ['A(2x2)BCD(2x2)EFG', 11],
        ['(6x1)(1x3)A', 6],
        ['X(8x2)(3x3)ABCY', 18],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 99145;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['(3x3)XYZ', 9],
        ['X(8x2)(3x3)ABCY', 20],
        ['(27x12)(20x12)(13x14)(7x10)(1x12)A', 241920],
        ['(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN', 445],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 10943094568;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
