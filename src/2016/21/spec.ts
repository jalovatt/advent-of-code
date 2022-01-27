import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { log } from '@lib/logging';
import { part1, part2 } from '.';

const title = 'Scrambled Letters and Hash';

const input = loadText('input.txt');

const example1 = `
swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['swap position 4 with position 0', 'abcde', 'ebcda'],
        ['swap letter d with letter b', 'ebcda', 'edcba'],
        ['reverse positions 0 through 4', 'edcba', 'abcde'],
        ['rotate left 1 step', 'abcde', 'bcdea'],
        ['rotate right 1 step', 'abcde', 'eabcd'],
        ['move position 1 to position 4', 'bcdea', 'bdeac'],
        ['move position 3 to position 0', 'bdeac', 'abdec'],
        ['rotate based on position of letter b', 'abdec', 'ecabd'],
        ['rotate based on position of letter d', 'ecabd', 'decab'],
        ['move position 0 to position 3', 'abcdefgh', 'bcdaefgh'],
        ['rotate right 0 steps', 'bcdaefgh', 'bcdaefgh'],
        ['rotate right 1 step', 'bcdaefgh', 'hbcdaefg'],
        ['move position 1 to position 5', 'hbcdaefg', 'hcdaebfg'],
        ['swap letter h with letter b', 'hcdaebfg', 'bcdaehfg'],
        ['reverse positions 1 through 3', 'bcdaehfg', 'badcehfg'],
        ['swap letter a with letter g', 'badcehfg', 'bgdcehfa'],
        ['swap letter b with letter h', 'bgdcehfa', 'hgdcebfa'],
        [example1, 'abcde', 'decab'],
      ])('%p: %p => %p', (given, start, expected) => {
        expect(part1(given, start)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 'agcebfdh';

      test(`${knownSolution}`, () => {
        const solution = part1(input, 'abcdefgh');

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['swap position 4 with position 0', 'ebcda', 'abcde'],
        ['swap letter d with letter b', 'edcba', 'ebcda'],
        ['reverse positions 0 through 4', 'abcde', 'edcba'],
        ['rotate left 1 step', 'bcdea', 'abcde'],
        ['rotate right 1 step', 'eabcd', 'abcde'],
        ['move position 1 to position 4', 'bdeac', 'bcdea'],
        ['move position 3 to position 0', 'abdec', 'bdeac'],
        ['rotate based on position of letter b', 'ecabd', 'abdec'],
        ['rotate based on position of letter d', 'decab', 'ecabd'],
        ['move position 0 to position 3', 'bcdaefgh', 'abcdefgh'],
        ['rotate right 0 steps', 'bcdaefgh', 'bcdaefgh'],
        ['rotate right 1 step', 'hbcdaefg', 'bcdaefgh'],
        ['move position 1 to position 5', 'hcdaebfg', 'hbcdaefg'],
        ['swap letter h with letter b', 'bcdaehfg', 'hcdaebfg'],
        ['reverse positions 1 through 3', 'badcehfg', 'bcdaehfg'],
        ['swap letter a with letter g', 'bgdcehfa', 'badcehfg'],
        ['swap letter b with letter h', 'hgdcebfa', 'bgdcehfa'],
        [example1, 'decab', 'abcde'],
      ])('%p: %p => %p', (given, start, expected) => {
        if (given.startsWith('rotate based')) {
          log(`${start} => ${expected}`);
        }
        expect(part2(given, start)).toEqual(expected);
      });

      test('Reverse part 1', () => {
        expect(part2(input, part1(input, 'abcdefgh'))).toEqual('abcdefgh');
      });
    });

    describe('Solution', () => {
      const knownSolution = 'afhdbegc';

      test(`${knownSolution}`, () => {
        const solution = part2(input, 'fbgdceah');

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
