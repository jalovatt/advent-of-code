import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['10000', 20, '01100'],
      ])('%p => %p', (given, length, expected) => {
        expect(solve(given, length)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = '00000100100001100';

      test(`${knownSolution}`, () => {
        const solution = solve(input, 272);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = '00011010100010010';

      test(`${knownSolution}`, () => {
        const solution = solve(input, 35651584);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
