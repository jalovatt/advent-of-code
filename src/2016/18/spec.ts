import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'Like a Rogue';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['..^^.', 3, 6],
        ['.^^.^.^^^^', 10, 38],
      ])('%p => %p', (given, rows, expected) => {
        expect(solve(given, rows)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1982;

      test(`${knownSolution}`, () => {
        const solution = solve(input, 40);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 20005203;

      test(`${knownSolution}`, () => {
        const solution = solve(input, 400000);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
