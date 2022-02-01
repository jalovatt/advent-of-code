import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Stream Processing';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['{}', 1],
        ['{{{}}}', 6],
        ['{{},{}}', 5],
        ['{{{},{},{{}}}}', 16],
        ['{<a>,<a>,<a>,<a>}', 1],
        ['{{<ab>},{<ab>},{<ab>},{<ab>}}', 9],
        ['{{<!!>},{<!!>},{<!!>},{<!!>}}', 9],
        ['{{<a!>},{<a!>},{<a!>},{<ab>}}', 3],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 10616;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['<>', 0],
        ['<random characters>', 17],
        ['<<<<>', 3],
        ['<{!>}>', 2],
        ['<!!>', 0],
        ['<!!!>>', 0],
        ['<{o"i!a,<{i<a>', 10],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 5101;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
