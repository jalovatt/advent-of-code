import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Red-Nosed Reports';

const input = loadText('input.txt');

const example1 = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

const example2 = `
10 6 4 4 1
10 7 3 3 1
9 6 4 4 0
9 10 7 4 2
`;

// Additional cases from Reddit, all should be safe
const example3 = `
48 46 47 49 51 54 56
1 1 2 3 4 5
1 2 3 4 5 5
5 1 2 3 4 5
1 4 3 2 1
1 6 7 8 9
1 2 3 4 3
9 8 7 6 7
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 2],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 407;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 4],
        [example2, 1],
        [example3, 8],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 459;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
