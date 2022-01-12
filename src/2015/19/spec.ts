import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Medicine for Rudolph';

const input = loadText('input.txt');

const example1 = `
H => HO
H => OH
O => HH

HOH
`;

const example2 = `
H => HO
H => OH
O => HH

HOHOHO
`;

const example3 = `
e => H
e => O
H => HO
H => OH
O => HH

HOH
`;

const example4 = `
e => H
e => O
H => HO
H => OH
O => HH

HOHOHO
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 4],
        [example2, 7],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 535;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example3, 3],
        [example4, 6],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 212;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
