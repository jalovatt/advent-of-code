import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { run, part1, part2, resolve } from '.';

const title = 'Some Assembly Required';

const input = loadText('input.txt');

const example1 = `
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
`;

const outputState1 = {
  d: 72,
  e: 507,
  f: 492,
  g: 114,
  h: 65412,
  i: 65079,
  x: 123,
  y: 456,
};

describeDay(title, () => {
  describe('Resolve', () => {
    test.each([
      [{ l: 1, op: 'AND', r: 1 }, 1],
      [{ l: 1, op: 'AND', r: 0 }, 0],
      [{ l: 1, op: 'OR', r: 0 }, 1],
      [{ l: 1, op: 'RSHIFT', r: 1 }, 0],
      [{ l: 8, op: 'RSHIFT', r: 2 }, 2],
      [{ l: 1, op: 'LSHIFT', r: 1 }, 2],
      [{ l: 8, op: 'LSHIFT', r: 2 }, 32],
      /*
        In 16-bit unsigned binary:
          123 = 0000000001111011
         ~123 = 1111111110000100 = 65412
      */
      [{ op: 'NOT', r: 123 }, 65412],
    ])('%p => %p', (given, expected) => {
      expect(resolve(given, {})).toEqual(expected);
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, outputState1],
      ])('%p => %p', (given, expected) => {
        expect(run(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 16076;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 2797;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
