import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2, validate1, validate2 } from '.';

const title = 'Internet Protocol Version 7';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['abba[mnop]qrst', 0],
        ['abcd[bddb]xyyx', false],
        ['aaaa[qwer]tyui', false],
        ['ioxxoj[asdfgh]zxcvbn', 1],
      ])('%p => %p', (given, expected) => {
        expect(validate1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 115;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['aba[bab]xyz', 4],
        ['xyx[xyx]xyx', false],
        ['aaa[kek]eke', 8],
        ['zazbz[bzb]cdb', 6],
      ])('%p => %p', (given, expected) => {
        expect(validate2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 231;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
