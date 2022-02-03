import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Packet Scanners';

const input = loadText('input.txt');

const example1 = `
0: 3
1: 2
4: 4
6: 4
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 24],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1960;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 10],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 3903378;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
