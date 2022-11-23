import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const knownSolution = 2343;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  xdescribe('Part 2', () => {
    describe('Solution', () => {
      test('prints answer as ASCII art', () => {
        part2(input);
      });
    });
  });
});
