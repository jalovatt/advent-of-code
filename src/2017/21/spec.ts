import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { Axis, flip, lineToPattern, solve, patternToLine, rotate } from '.';

const title = 'Fractal Art';

const input = loadText('input.txt');

const example1 = `
../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('rotate', () => {
      test.each([
        ['.#/##', '##/.#'],
        ['##/.#', '##/#.'],
        ['.#./..#/###', '.##/#.#/..#'],
        ['.##/#.#/..#', '###/#../.#.'],
      ])('%p => %p', (given, expected) => {
        expect(patternToLine(rotate(lineToPattern(given)))).toEqual(expected);
      });
    });

    describe('flipped', () => {
      test.each([
        ['.#/##', Axis.X, '#./##'],
        ['.#/##', Axis.Y, '##/.#'],
        ['.#./..#/###', Axis.X, '.#./#../###'],
        ['.#./..#/###', Axis.Y, '###/..#/.#.'],
      ] as [string, Axis, string][])('%p => %p', (given, axis, expected) => {
        expect(patternToLine(flip(lineToPattern(given), axis))).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        [example1, 12],
      ])('%p => %p', (given, expected) => {
        expect(solve(given, 2)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 117;

      test(`${knownSolution}`, () => {
        const solution = solve(input, 5);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 2026963;

      test(`${knownSolution}`, () => {
        const solution = solve(input, 18);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
