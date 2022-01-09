import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

const example1 = `
Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 11, 176],
        [example1, 1000, 1120],
      ])('%p => %p', (given, t, expected) => {
        expect(part1(given, t)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 2696;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 2503);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 1000, 689],
      ])('%p => %p', (given, t, expected) => {
        expect(part2(given, t)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1084;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 2503);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
