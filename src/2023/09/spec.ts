import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2, getNextInSequence } from '.';

const title = 'Mirage Maintenance';

const input = loadText('input.txt');

const example1 = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('getNextInSequence', () => {
      test.each([
        [[0, 3, 6, 9, 12, 15], 18],
        [[1, 3, 6, 10, 15, 21], 28],
        [[10, 13, 16, 21, 30, 45], 68],
      ])('%p => %p', (given, expected) => {
        expect(getNextInSequence(given)).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        [example1, 114],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1953784198;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 2],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 957;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
