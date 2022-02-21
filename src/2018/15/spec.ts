import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'Beverage Bandits';

const input = loadText('input.txt');

// [input, [part1, part2]
const examples: [string, [number, number]][] = [
  [`
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######
  `,
  [27730, 4988],
  ],
  [`
#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######
  `,
  [27755, 3478],
  ],
  [`
#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
  `,
  [28944, 6474],
  ],
  [`
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
  `,
  [18740, 1140],
  ],
];

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      describe('Example Combats', () => {
        test.each(examples)('.', (given, expected) => {
          expect(part1(given)).toEqual(expected[0]);
        });
      });
    });

    describe('Solution', () => {
      const knownSolution = 198531;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Example Combats', () => {
      test.each(examples)('.', (given, expected) => {
        expect(part2(given)).toEqual(expected[1]);
      });
    });

    describe('Solution', () => {
      const knownSolution = 90420;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
