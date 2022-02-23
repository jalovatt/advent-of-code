import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2, parseInput, testSample } from '.';

const title = 'Chronal Classification';

const input = loadText('input.txt');

const example1 = `
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`;

const example2 = `
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]

Before: [2, 1, 2, 3]
1 3 3 2
After:  [2, 1, 3, 3]

Before: [2, 3, 2, 3]
14 3 2 3
After:  [2, 3, 2, 2]

Before: [3, 3, 1, 1]
8 2 3 1
After:  [3, 1, 1, 1]

Before: [0, 1, 0, 0]
0 3 1 3
After:  [0, 1, 0, 1]

Before: [2, 1, 1, 2]
15 0 1 1
After:  [2, 3, 1, 2]

Before: [0, 2, 2, 1]
15 0 2 1
After:  [0, 2, 2, 1]

Before: [0, 2, 1, 0]
3 0 0 1
After:  [0, 0, 1, 0]

Before: [3, 1, 2, 0]
0 3 1 2
After:  [3, 1, 1, 0]

Before: [0, 1, 2, 1]
5 1 3 1
After:  [0, 1, 2, 1]

Before: [2, 2, 2, 3]
11 3 3 1
After:  [2, 9, 2, 3]

Before: [2, 1, 0, 3]
14 2 1 2
After:  [2, 1, 1, 3]

Before: [0, 3, 2, 2]
4 0 2 0
After:  [0, 3, 2, 2]

Before: [1, 0, 3, 3]
12 3 1 1
After:  [1, 3, 3, 3]

Before: [0, 2, 3, 2]
7 2 3 3
After:  [0, 2, 3, 2]

Before: [1, 1, 2, 3]
10 1 3 3
After:  [1, 1, 2, 3]

Before: [2, 2, 2, 1]
6 3 2 1
After:  [2, 3, 2, 1]

Before: [2, 1, 2, 0]
2 0 3 1
After:  [2, 3, 2, 0]

Before: [1, 2, 3, 3]
11 2 3 1
After:  [1, 9, 3, 3]

Before: [2, 1, 2, 2]
13 1 3 2
After:  [2, 1, 3, 2]
`;

const individualSamples: [string, number][] = [
  [`
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
  `,
  3,
  ],
  [`
Before: [2, 1, 2, 3]
1 3 3 2
After:  [2, 1, 3, 3]
  `,
  6,
  ],
  [`
Before: [2, 3, 2, 3]
14 3 2 3
After:  [2, 3, 2, 2]
  `,
  2,
  ],
  [`
Before: [3, 3, 1, 1]
8 2 3 1
After:  [3, 1, 1, 1]
  `,
  7,
  ],
  [`
Before: [0, 1, 0, 0]
0 3 1 3
After:  [0, 1, 0, 1]
  `,
  5,
  ],
  [`
Before: [2, 1, 1, 2]
15 0 1 1
After:  [2, 3, 1, 2]
  `,
  4,
  ],
  [`
Before: [0, 2, 2, 1]
15 0 2 1
After:  [0, 2, 2, 1]
  `,
  4,
  ],
  [`
Before: [0, 2, 1, 0]
3 0 0 1
After:  [0, 0, 1, 0]
  `,
  13,
  ],
  [`
Before: [3, 1, 2, 0]
0 3 1 2
After:  [3, 1, 1, 0]
  `,
  5,
  ],
  [`
Before: [0, 1, 2, 1]
5 1 3 1
After:  [0, 1, 2, 1]
  `,
  8,
  ],
  [`
Before: [2, 2, 2, 3]
11 3 3 1
After:  [2, 9, 2, 3]
  `,
  2,
  ],
  [`
Before: [2, 1, 0, 3]
14 2 1 2
After:  [2, 1, 1, 3]
  `,
  5,
  ],
  [`
Before: [0, 3, 2, 2]
4 0 2 0
After:  [0, 3, 2, 2]
  `,
  12,
  ],
  [`
Before: [1, 0, 3, 3]
12 3 1 1
After:  [1, 3, 3, 3]
  `,
  6,
  ],
  [`
Before: [0, 2, 3, 2]
7 2 3 3
After:  [0, 2, 3, 2]
  `,
  2,
  ],
  [`
Before: [1, 1, 2, 3]
10 1 3 3
After:  [1, 1, 2, 3]
  `,
  4,
  ],
  [`
Before: [2, 2, 2, 1]
6 3 2 1
After:  [2, 3, 2, 1]
  `,
  5,
  ],
  [`
Before: [2, 1, 2, 0]
2 0 3 1
After:  [2, 3, 2, 0]
  `,
  1,
  ],
  [`
Before: [1, 2, 3, 3]
11 2 3 1
After:  [1, 9, 3, 3]
  `,
  2,
  ],
  [`
Before: [2, 1, 2, 2]
13 1 3 2
After:  [2, 1, 3, 2]
  `,
  4,
  ],
];

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Individual samples', () => {
      test.each(individualSamples)('.', (given, expected) => {
        const [samples] = parseInput(given);
        const count = testSample(samples[0], true).length;

        expect(count).toEqual(expected);
      });
    });

    describe('Tests', () => {
      test.each([
        [example1, 1],
        [example2, 15],
      ])('%#', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 547;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 582;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
