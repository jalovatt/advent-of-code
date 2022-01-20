import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { decrypt, part1, part2, validate } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['aaaaa-bbb-z-y-x-123[abxyz]', 123],
        ['a-b-c-d-e-f-g-h-987[abcde]', 987],
        ['not-a-real-room-404[oarel]', 404],
        ['totally-real-room-200[decoy]', false],
      ])('%p => %p', (given, expected) => {
        expect(validate(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 278221;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['qzmt-zixmtkozy-ivhz-343', 'very encrypted name'],
      ])('%p => %p', (given, expected) => {
        expect(decrypt(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 267;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
