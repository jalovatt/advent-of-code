import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Doesn\'t He Have Intern-Elves For This?';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['ugknbfddgicrmopn', 1],
        ['aaa', 1],
        ['jchzalrnumimnmhp', 0],
        ['haegwjzuvuyypxyu', 0],
        ['dvszwmarrgswjxmb', 0],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 236;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['qjhvhtzxzqqjkmpb', 1],
        ['xxyxx', 1],
        ['uurcxstgmygtbstg', 0],
        ['ieodomkazucvgmuy', 0],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 51;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
