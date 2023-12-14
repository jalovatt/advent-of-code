import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Day 14: Parabolic Reflector Dish';

const input = loadText('input.txt');

const example1 = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 136],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 106990;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 1000000000, 64],
      ])('%p x %p cycles => %p', (given, cycles, expected) => {
        expect(part2(given, cycles)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 100531;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 1000000000);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
