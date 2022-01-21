import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Two-Factor Authentication';

const input = loadText('input.txt');

const example1 = `
rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 6],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 116;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = `
#..#.###...##....##.####.#....###...##..####.####.
#..#.#..#.#..#....#.#....#....#..#.#..#.#.......#.
#..#.#..#.#..#....#.###..#....###..#....###....#..
#..#.###..#..#....#.#....#....#..#.#....#.....#...
#..#.#....#..#.#..#.#....#....#..#.#..#.#....#....
.##..#.....##...##..#....####.###...##..####.####.
`;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution.trim());
      });
    });
  });
});
