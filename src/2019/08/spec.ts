import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['123456789012', 1],
      ])('%p => %p', (given, expected) => {
        expect(part1(given, 3, 2)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 2016;

      test(`${knownSolution}`, () => {
        const solution = part1(input, 25, 6);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['0222112222120000', '█.\n.█'],
      ])('%p => %p', (given, expected) => {
        expect(part2(given, 2, 2)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = `
      .██.█....██..██....█.██.█
      .██.████.█.██.████.█.██.█
      ....███.██.██████.██.██.█
      .██.██.███.█████.███.██.█
      .██.█.████.██.█.████.██.█
      .██.█....██..██....██..██
      `.trim().replace(/\n\s*/g, '\n');

      test(`${knownSolution}`, () => {
        const solution = part2(input, 25, 6);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
