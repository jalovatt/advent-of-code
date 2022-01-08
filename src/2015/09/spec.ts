import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'All in a Single Night';

const input = loadText('input.txt');

const example1 = `
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 605],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 251;

      test(`${knownSolution}`, () => {
        expect(part1(input)).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 982],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 898;

      test(`${knownSolution}`, () => {
        expect(part2(input)).toEqual(knownSolution);
      });
    });
  });
});
