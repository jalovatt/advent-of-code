import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Balance Bots';

const input = loadText('input.txt');

const example1 = `
value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, [5, 2] as [number, number], 2],
      ])('%p => %p', (given, botComparing, expected) => {
        expect(part1(given, botComparing)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 181;

      test(`${knownSolution}`, () => {
        const solution = part1(input, [61, 17]);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 12567;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
