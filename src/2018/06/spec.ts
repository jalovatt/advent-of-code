import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Chronal Coordinates';

const input = loadText('input.txt');

const example1 = `
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 17],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 4016;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 32, 16],
      ] as [string, number, number][])('%p => %p', (given, maxSum, expected) => {
        expect(part2(given, maxSum)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 46306;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 10000);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
