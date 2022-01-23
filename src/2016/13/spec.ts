import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

const example1 = `
10
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, [7, 4], 11],
      ])('%p => %p', (given, target, expected) => {
        expect(solve(given, target as [number, number])).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 82;

      test(`${knownSolution}`, () => {
        const solution = solve(input, [31, 39]);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 138;

      test(`${knownSolution}`, () => {
        const solution = solve(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
