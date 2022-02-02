import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Knot Hash';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['3,4,1,5', 5, 12],
      ])('%p => %p', (given, n, expected) => {
        expect(part1(given, n)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 5577;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      describe('Tests', () => {
        test.each([
          ['', 'a2582a3a0e66e6e86e3812dcb672a272'],
          ['AoC 2017', '33efeb34ea91902bb2f59c9920caa6cd'],
          ['1,2,3', '3efbe78a8d82f29979031a4aa0b16a9d'],
          ['1,2,4', '63960835bcdc130f0b66d7ff4f6a5a8e'],
        ])('%p => %p', (given, expected) => {
          expect(part2(given)).toEqual(expected);
        });
      });
    });

    describe('Solution', () => {
      const knownSolution = '44f4befb0f303c0bafd085f97741d51d';

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
