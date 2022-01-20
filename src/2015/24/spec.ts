import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'It Hangs in the Balance';

const input = loadText('input.txt');

const example1 = `
1
2
3
4
5
7
8
9
10
11
`;

describeDay(title, () => {
  describe('Part 1 (bitmasking)', () => {
    describe('Tests', () => {
      test.each([
        [example1, 99],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 10723906903;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2 (bitmasking)', () => {
    describe('Tests', () => {
      test.each([
        [example1, 44],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 74850409;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
