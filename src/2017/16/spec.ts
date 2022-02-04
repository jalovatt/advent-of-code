import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Permutation Promenade';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['s1,x3/4,pe/b', 5, 'baedc'],
      ])('%p => %p', (given, n, expected) => {
        expect(part1(given, n)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 'ceijbfoamgkdnlph';

      test(`${knownSolution}`, () => {
        const solution = part1(input, 16);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 'pnhajoekigcbflmd';

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
