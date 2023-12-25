import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Never Tell Me The Odds';

const input = loadText('input.txt');

const example1 = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`;

const example2 = `
1
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 7, 27, 2],
      ])('%p => %p', (given, minBound, maxBound, expected) => {
        expect(part1(given, minBound, maxBound)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 13149;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 200000000000000, 400000000000000);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 47],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    xdescribe('Solution', () => {
      const knownSolution = null;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
