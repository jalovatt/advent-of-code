import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

const example1 = `
cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 3],
      ])('%p => %p', (given, expected) => {
        expect(solve(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 12748;

      test(`${knownSolution}`, () => {
        const solution = solve(input, 7);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  // v. slow, 3-4 minutes for tests + solution
  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 8428],
        [7, 12748],
        [8, 48028],
        [9, 370588],
        [10, 3636508],
        [11, 39924508],
      ])('%p => %p', (given, expected) => {
        expect(solve(input, given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = null;

      test(`${knownSolution}`, () => {
        const solution = solve(input, 479009308);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
