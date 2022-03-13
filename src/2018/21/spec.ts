import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Chronal Conversion';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const knownSolution = 10780777;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  // takes ~1m
  xdescribe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 13599657;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
