import loadText from '@lib/loadText';
import { a, b } from '.';

const title = 'Smoke Basin';

const input = loadText('input.txt');

const example1 = `
2199943210
3987894921
9856789892
8767896789
9899965678
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 15],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 591;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 1134],
      ])('%p => %p', (given, expected) => {
        expect(b(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1113424;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
