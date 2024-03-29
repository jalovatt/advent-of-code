import loadText from '@lib/loadText';
import {
  a,
  b,
  magnitude,
  sum,
  explode,
  split,
  add,
  reduce,
} from '.';

const title = 'Snailfish';

const input = loadText('input.txt');

const example1 = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Operations', () => {
    describe('Explode', () => {
      test.each([
        ['[[6,[5,[4,[3,2]]]],1]', '[[6,[5,[7,0]]],3]'],
        ['[[[[[9,8],1],2],3],4]', '[[[[0,9],2],3],4]'],
        ['[7,[6,[5,[4,[3,2]]]]]', '[7,[6,[5,[7,0]]]]'],
        ['[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'],
        ['[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[7,0]]]]'],
        ['[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]', '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]'],
      ])('%p => %p', (given, expected) => {
        expect(explode(given)).toEqual(expected);
      });
    });

    describe('Split', () => {
      test.each([
        ['[[[[0,7],4],[15,[0,13]]],[1,1]]', '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]'],
        ['[[[[0,7],4],[[7,8],[0,13]]],[1,1]]', '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]'],
      ])('%p => %p', (given, expected) => {
        expect(split(given)).toEqual(expected);
      });
    });

    describe('Add', () => {
      test.each([
        [['[1,2]', '[[3,4],5]'], '[[1,2],[[3,4],5]]'],
      ])('%p => %p', (given, expected) => {
        expect(add(given[0], given[1])).toEqual(expected);
      });
    });

    describe('Magnitude', () => {
      test.each([
        ['[[1,2],[[3,4],5]]', 143],
        ['[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', 1384],
        ['[[[[1,1],[2,2]],[3,3]],[4,4]]', 445],
        ['[[[[3,0],[5,3]],[4,4]],[5,5]]', 791],
        ['[[[[5,0],[7,4]],[5,5]],[6,6]]', 1137],
        ['[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', 3488],
      ])('%p => %p', (given, expected) => {
        expect(magnitude(given)).toEqual(expected);
      });
    });

    describe('Sum', () => {
      test.each([
        [[
          '[1,1]',
          '[2,2]',
          '[3,3]',
          '[4,4]',
        ], '[[[[1,1],[2,2]],[3,3]],[4,4]]'],
        [[
          '[1,1]',
          '[2,2]',
          '[3,3]',
          '[4,4]',
          '[5,5]',
        ], '[[[[3,0],[5,3]],[4,4]],[5,5]]'],
        [[
          '[1,1]',
          '[2,2]',
          '[3,3]',
          '[4,4]',
          '[5,5]',
          '[6,6]',
        ], '[[[[5,0],[7,4]],[5,5]],[6,6]]'],
        [[
          '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]',
          '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]',
          '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]',
          '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]',
          '[7,[5,[[3,8],[1,4]]]]',
          '[[2,[2,2]],[8,[8,1]]]',
          '[2,9]',
          '[1,[[[9,3],9],[[9,0],[0,7]]]]',
          '[[[5,[7,4]],7],1]',
          '[[[[4,2],2],6],[8,7]]',
        ], '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]'],
      ])('%p => %p', (given, expected) => {
        expect(sum(given)).toEqual(expected);
      });
    });

    describe('Add + Sum', () => {
      test.each([
        [[
          '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]',
          '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]',
        ], '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]',
        ],
        [[
          '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]',
          '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]',
        ], '[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]'],
        [[
          '[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]',
          '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]',
        ], '[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]'],
        [[
          '[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]',
          '[7,[5,[[3,8],[1,4]]]]',
        ], '[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]'],
        [[
          '[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]',
          '[[2,[2,2]],[8,[8,1]]]',
        ], '[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]'],
        [[
          '[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]',
          '[2,9]',
        ], '[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]'],
        [[
          '[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]',
          '[1,[[[9,3],9],[[9,0],[0,7]]]]',
        ], '[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]'],
        [[
          '[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]',
          '[[[5,[7,4]],7],1]',
        ], '[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]'],
        [[
          '[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]',
          '[[[[4,2],2],6],[8,7]]',
        ], '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]'],
        [[
          '[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]',
          '[[[5,[2,8]],4],[5,[[9,9],0]]]',
          '[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]',
          '[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]',
          '[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]',
          '[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]',
          '[[[[5,4],[7,7]],8],[[8,3],8]]',
          '[[9,3],[[9,9],[6,[4,9]]]]',
          '[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]',
          '[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]',
        ], '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]'],
      ])('%p => %p', (given, expected) => {
        expect(sum(given)).toEqual(expected);
      });
    });

    describe('Reduce', () => {
      test.each([
        ['[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]', '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]'],
      ])('%p => %p', (given, expected) => {
        expect(reduce(given)).toEqual(expected);
      });
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 4140],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 3524;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [example1, 3993],
      ])('%p => %p', (given, expected) => {
        expect(b(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 4656;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
