import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'An Elephant Named Joseph';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['5', 3],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1842613;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      const nearestPowerOf3 = (n: number): number => (Math.log(n) / Math.log(3)) >> 0;

      /*
        Copied from Reddit to check my answers against:
        https://www.reddit.com/r/adventofcode/comments/5j4lp1/comment/dbe0n3j/?utm_source=share&utm_medium=web2x&context=3
      */
      const mathSolution = (n: number): number => {
        const prev = 3 ** nearestPowerOf3(n - 1);

        return (n - prev + Math.max(0, n - 2 * prev));
      };

      test.each([
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['9'],
        ['18'],
        ['26'],
        ['27'],
      ])('%p => %p', (given) => {
        expect(part2(given)).toEqual(mathSolution(parseInt(given, 10)));
      });
    });

    describe('Solution', () => {
      const knownSolution = 1424135;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
