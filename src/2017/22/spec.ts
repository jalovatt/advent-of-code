import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Sporifica Virus';

const input = loadText('input.txt');

const example1 = `
..#
#..
...
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 7, 5],
        [example1, 70, 41],
        [example1, 10000, 5587],
      ])('%p => %p', (given, turns, expected) => {
        expect(part1(given, turns)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 5261;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 10000);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 100, 26],
        [example1, 10000000, 2511944],
      ])('%p => %p', (given, turns, expected) => {
        expect(part2(given, turns)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 2511927;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 10000000);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
