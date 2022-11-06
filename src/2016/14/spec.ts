import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve, part2 } from '.';

const title = 'One-Time Pad';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['abc', 22728],
      ])('%p => %p', (given, expected) => {
        expect(solve(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 35186;

      test(`${knownSolution}`, () => {
        const solution = solve(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  // V. slow, takes ~90s
  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['abc', 22551],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 22429;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
