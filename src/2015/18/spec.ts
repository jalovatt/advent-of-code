import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Like a GIF For Your Yard';

const input = loadText('input.txt');

const example1 = `
.#.#.#
...##.
#....#
..#...
#.#..#
####..
`;

const example2 = `
##.#.#
...##.
#....#
..#...
#.#..#
####.#
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 4],
      ])('%p => %p', (given, expected) => {
        expect(part1(given, 4)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 821;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 100);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example2, 17],
      ])('%p => %p', (given, expected) => {
        expect(part2(given, 5)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 886;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 100);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
