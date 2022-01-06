import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { getHash, part1, part2 } from '.';

const title = 'The Ideal Stocking Stuffer';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Hashing', () => {
      test.each([
        ['abcdef', 609043, '000001dbbfa'],
        ['pqrstuv', 1048970, '000006136ef'],
      ])('%p => %p', (str, v, expected) => {
        expect(getHash(`${str}${v}`).slice(0, 11)).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        ['abcdef', 609043],
        ['pqrstuv', 1048970],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 117946;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    // Takes ~20s
    describe('Solution', () => {
      const knownSolution = 3938038;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
