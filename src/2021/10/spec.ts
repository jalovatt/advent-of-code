import loadText from '@lib/loadText';
import { a, b } from '.';

const title = 'Syntax Scoring';

const input = loadText('input.txt');

const example1 = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`;

const failingLines: [string, number][] = [
  ['{([(<{}[<>[]}>{[]{[(<()>', 1197],
  ['[[<[([]))<([[{}[[()]]]', 3],
  ['[{[{({}]{}}([{[{{{}}([]', 57],
  ['[<(<(<(<{}))><([]([]()', 3],
  ['<{([([[(<>()){}]>(<<{{', 25137],
];

const passingLines: [string, number][] = [
  ['[({(<(())[]>[[{[]{<()<>>', 288957], // }}]])})]
  ['[(()[<>])]({[<{<<[]>>(', 5566], // )}>]})
  ['(((({<>}<{<{<>}{[]{[]{}', 1480781], // }}>}>))))
  ['{<[[]]>}<{[{[{[]{()[[[]', 995444], // ]]}}]}]}>
  ['<{([{{}}[<[[[<>{}]]]>[]]', 294], // ])}>
];

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ...failingLines,
        [example1, 26397],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 243939;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ...passingLines,
        [example1, 288957],
      ])('%p => %p', (given, expected) => {
        expect(b(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 2421222841;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
