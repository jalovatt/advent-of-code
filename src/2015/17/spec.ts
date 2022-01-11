import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { countActiveBits, part1, part2 } from '.';

const title = 'No Such Thing as Too Much';

const input = loadText('input.txt');

const example1 = `
20
15
10
5
5
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 25, 4],
      ])('%p => %p', (given, total, expected) => {
        expect(part1(given, total)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 4372;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 150);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('countActiveBits', () => {
      test.each([
        [0b0000, 0],
        [0b0001, 1],
        [0b1001, 2],
        [0b1111, 4],
      ])('%p => %p', (given, expected) => {
        expect(countActiveBits(given)).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        [example1, 25, 3],
      ])('%p => %p', (given, total, expected) => {
        expect(part2(given, total)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 4;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 150);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
