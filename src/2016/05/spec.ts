import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'How About a Nice Game of Chess?';

const input = loadText('input.txt');

describeDay(title, () => {
  // v. slow, ~20s per test
  xdescribe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['abc', '18f47a30'],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = '4543c154';

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  // ~50s for the solution
  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['abc', '05ace8e3'],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = '1050cbbd';

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
