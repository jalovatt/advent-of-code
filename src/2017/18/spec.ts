import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Duet';

const input = loadText('input.txt');

const example1 = `
set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2
`;

const example2 = `
snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 4],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 8600;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example2, 3],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 7239;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
