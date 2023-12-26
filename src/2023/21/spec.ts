import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Step Counter';

const input = loadText('input.txt');

const example1 = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 6, 16],
      ])('%p => %p', (given, steps, expected) => {
        expect(part1(given, steps)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 3722;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 64);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 6, 16],
        // [example1, 10, 50],
        // [example1, 50, 1594],
        // [example1, 100, 6536],
        // [example1, 500, 167004],
        // [example1, 1000, 668697],
        // [example1, 5000, 16733044],
      ])('%p => %p', (given, steps, expected) => {
        expect(part2(given, steps)).toEqual(expected);
      });
    });

    xdescribe('Solution', () => {
      const knownSolution = null;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 26501365);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
