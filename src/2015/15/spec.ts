import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { incrementState, scoreState, part1, part2, parseInput } from '.';

const title = 'Science for Hungry People';

const input = loadText('input.txt');

/*
  A capacity of 44*-1 + 56*2 = 68
  A durability of 44*-2 + 56*3 = 80
  A flavor of 44*6 + 56*-2 = 152
  A texture of 44*3 + 56*-1 = 76

  68 * 80 * 152 * 76 = 62842880
*/
const example1 = `
Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('incrementState', () => {
      test.each([
        [0b0, 0, 0b1],
        [0b10000001, 1, 0b100000001],
        [0b100000010000001, 2, 0b1000000010000001],
        [0b1000000100000010000001, 3, 0b10000000100000010000001],
      ])('%p @ %p => %p', (given, index, expected) => {
        expect(incrementState(given, index)).toEqual(expected);
      });
    });

    describe('scoreState', () => {
      test.each([
        [0b1110000101100, example1, 62842880],
      ])('%p => %p', (given, rawIngredients, expected) => {
        const [ingredients] = parseInput(rawIngredients);
        expect(scoreState(given, ingredients)).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        [example1, 62842880],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 21367368;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 57600000],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 1766400;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
