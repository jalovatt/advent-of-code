import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'The Floor Will Be Lava';

const input = loadText('input.txt');

const example1 = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`;

// Test cases from
// https://www.reddit.com/r/adventofcode/comments/18jl9lu/2023_day_16_part1_example_works_but_wrong_answer/
const example2 = `
..|..
.....
..-..
`;

const example3 = `
...\\...
.......
-......
.......
\\../...
`;

const example4 = `
|....-
......
......
-....|
`;

const example5 = `
......|...\\..\\...
..../........|...
....\\.-.../......
......|....../...
.................
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 46],
        [example2, 9],
        [example3, 18],
        [example4, 16],
        [example5, 41],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 7034;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 51],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 7759;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
