import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Point of Incidence';

const input = loadText('input.txt');

const example1 = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.
`;

const example2 = `
#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

const example3 = `
#..#####.##.#..
.#..##.#.####..
...##..##.#..##
.######.#.#.#..
#.#..###.....##
....##..#....##
..##.#.#.#.#.##
##..#...#..##..
#...###..##.###
.###..#.#.#..##
..#.###.##..###
###.#.#####....
#.#.#.#####....
..#.###.##..###
.###..#.#.#..##
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 5],
        [example2, 400],
        [example3, 14],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 34821;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 300],
        [example2, 100],
        [example3, 1200], // I think?
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 36919;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
