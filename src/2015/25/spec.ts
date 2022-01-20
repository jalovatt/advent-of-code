import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { nthInSequence, part1 } from '.';

const title = 'Let It Snow';

const input = loadText('input.txt');

const example1 = [
  31916031,
  18749137,
  16080970,
  21629792,
  17289845,
  24592653,
  8057251,
  16929656,
  30943339,
  77061,
  32451966,
  1601130,
  7726640,
  10071777,
  33071741,
  17552253,
  21345942,
  7981243,
  15514188,
  33511524,
];

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Sequence', () => {
      test.each(
        example1.map((n, i) => [i + 2, n]),
      )('%p => %p', (given, expected) => {
        expect(nthInSequence(given)).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        ['5,1', 77061],
        ['4,4', 9380097],
        ['5,6', 31663883],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 9132360;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
