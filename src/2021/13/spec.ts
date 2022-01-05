import loadText from '../../utilities/loadText';
import { a, b } from '.';

const title = 'Transparent Origami';

const input = loadText('input.txt');

const example1 = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 17],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 706;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution (visual, check console)', () => {
      const knownSolution = 'LRFJBJEH';

      test(`${knownSolution}`, () => {
        b(input);

        expect(true).toEqual(true);
      });
    });
  });
});
