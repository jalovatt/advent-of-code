import loadText from '@lib/loadText';
import { a, CucumberSim } from '.';

const title = 'Sea Cucumber';

const input = loadText('input.txt');

const example1 = [`
..........
.>v....v..
.......>..
..........
`, `
..........
.>........
..v....v>.
..........
`,
];

const example2 = [`
...>...
.......
......>
v.....>
......>
.......
..vvv..
`, `
..vv>..
.......
>......
v.....>
>......
.......
....v..
`];

const example3 = [`
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`, `
....>.>v.>
v.v>.>v.v.
>v>>..>v..
>>v>v>.>.v
.>v.v...v.
v>>.>vvv..
..v...>>..
vv...>>vv.
>.v.v..v.v
`];

const example4 = [`
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`, `
..>>v>vv..
..v.>>vv..
..>>v>>vv.
..>>>>>vv.
v......>vv
v>v....>>v
vvv.....>>
>vv......>
.>v.vv.v..
`];

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Parsing', () => {
    test.each([
      ['...>>>>>...'],
      ['...>>>>.>..'],
      [example1[0]],
      [example2[0]],
      [example3[0]],
    ])('%p => %p', (given) => {
      const sim = new CucumberSim(given);

      expect(sim.describe()).toEqual(given.trim());
    });
  });

  describe('Step', () => {
    test.each([
      ['...>>>>>...', '...>>>>.>..'],
      ['...>>>>.>..', '...>>>.>.>.'],
      example1,
      example2,
      example3,
    ])('%p => %p', (given, expected) => {
      const sim = new CucumberSim(given);
      sim.step();

      expect(sim.describe()).toEqual(expected.trim());
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example4[0], 58],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 337;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
