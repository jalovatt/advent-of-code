import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'Timing is Everything';

const input = loadText('input.txt');

const example1 = `
Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.
`;

const part2Add = `
has 11 positions; at time=0, it is at position 0
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 5],
      ])('%p => %p', (given, expected) => {
        expect(solve(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 121834;

      test(`${knownSolution}`, () => {
        const solution = solve(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 3208099;

      test(`${knownSolution}`, () => {
        const solution = solve(`${input.trim()}\n${part2Add.trim()}`);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
