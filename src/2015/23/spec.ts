import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Opening the Turing Lock';

const input = loadText('input.txt');

const example1 = `
inc a
jio a, +2
tpl a
inc a
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 2],
      ])('%p => %p', (given, expected) => {
        expect(part1(given, 'a')).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 255;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 'b');

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 334;

      test(`${knownSolution}`, () => {
        const solution = part2(input, 'b');

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
