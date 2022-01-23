import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { solve } from '.';

const title = 'Radioisotope Thermoelectric Generators';

const input = loadText('input.txt');

const example1 = `
The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.
`;

const part2Add = 'The first floor contains a elerium generator, a elerium-compatible microchip, a dilithium generator, and a dilithium-compatible microchip.';

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 11],
      ])('%p => %p', (given, expected) => {
        expect(solve(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 37;

      test(`${knownSolution}`, () => {
        const solution = solve(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 61;

      test(`${knownSolution}`, () => {
        const solution = solve(input, part2Add);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
