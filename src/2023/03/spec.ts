import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Gear Ratios';

const input = loadText('input.txt');

const example1 = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

const example2 = `
...788...........................
..../..*963......................
............*......41..481+......
............707....&.........562.
.....210................356..*...
..............14..312......+..926
...416../467.....................
.....................*688...=....
..673/.....957...............103.
.......628....*..62.......15.....
...*....*....222..*.........*795.
418..*..57........125...141......
....926...................*.#....
..............$476....167....208.
...571.977...............*.......
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 4361],
        [example2, 11952],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 554003;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 467835],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 87263515;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
