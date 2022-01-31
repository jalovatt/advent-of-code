import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'Clock Signal';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const knownSolution = 182;

      test(`${knownSolution}`, () => {
        const solution = solve(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
