import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'A Regular Map';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['^WNE$', 3],
        ['^ENWWW(NEEE|SSE(EE|N))$', 10],
        ['^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', 18],
        ['^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$', 23],
        ['^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$', 31],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 3502;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 8000;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
