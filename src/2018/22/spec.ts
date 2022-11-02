import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Mode Maze';

const input = loadText('input.txt');

describeDay(title, () => {
  xdescribe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['depth: 510\ntarget: 10, 10', 114],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 8735;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        // ['depth: 510\ntarget: 10, 10', 45],
        ['depth: 11109\ntarget: 4, 19', 37],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    xdescribe('Solution', () => {
      // 1024 too high
      const knownSolution = null;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
