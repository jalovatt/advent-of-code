import loadText from '../../utilities/loadText';
import { log } from '../../utilities/logging';
import { a, b, encodeState, parseInput, searchStep } from './index';

const title = 'No title yet';

const input = loadText('input.txt');

const example1 = `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  xdescribe('State hashing', () => {
    describe('encode', () => {
      test.each([
        [[0, 0], 0],
        [[0, 1], 4],
        [[1, 0], 1],
        [[1, 1], 5],
        [[3, 11], 47],
      ])('%p => %p', (given, expected) => {
        expect(state.encode(given[0], given[1])).toEqual(expected);
      });
    });

    describe('decode', () => {
      test.each([
        [0, [0, 0]],
        [4, [0, 1]],
        [1, [1, 0]],
        [5, [1, 1]],
        [47, [3, 11]],
      ])('%p => %p', (given, expected) => {
        expect(state.decode.y(given)).toEqual(expected[0]);
        expect(state.decode.x(given)).toEqual(expected[1]);
      });
    });

    test('get', () => {
      /*
        111000101101010010000111101010010101111111110011
        111000  101101  010010  000111  101010  010101  111111  110011

        111000101101010010000111101010010101111111110011
        reverses to
        110011111111101010010101111000010010101101000111
        110011  111111  101010  010101  111000  010010  101101  000111
      */
      const given = BigInt('0b111000101101010010000111101010010101111111110011110011111111101010010101111000010010101101000111');
      const expected = [
        0b111000,
        0b101101,
        0b010010,
        0b000111,
        0b101010,
        0b010101,
        0b111111,
        0b110011,
        0b110011,
        0b111111,
        0b101010,
        0b010101,
        0b111000,
        0b010010,
        0b101101,
        0b000111,
      ];

      expect(state.get.d4(given)).toEqual(expected[0]);
      expect(state.get.c4(given)).toEqual(expected[1]);
      expect(state.get.b4(given)).toEqual(expected[2]);
      expect(state.get.a4(given)).toEqual(expected[3]);
      expect(state.get.d3(given)).toEqual(expected[4]);
      expect(state.get.c3(given)).toEqual(expected[5]);
      expect(state.get.b3(given)).toEqual(expected[6]);
      expect(state.get.a3(given)).toEqual(expected[7]);
      expect(state.get.d2(given)).toEqual(expected[8]);
      expect(state.get.c2(given)).toEqual(expected[9]);
      expect(state.get.b2(given)).toEqual(expected[10]);
      expect(state.get.a2(given)).toEqual(expected[11]);
      expect(state.get.d1(given)).toEqual(expected[12]);
      expect(state.get.c1(given)).toEqual(expected[13]);
      expect(state.get.b1(given)).toEqual(expected[14]);
      expect(state.get.a1(given)).toEqual(expected[15]);
    });

    test('set', () => {
      const base = BigInt('0b101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010');
      const on = 0b111111;

      const expected = [
        BigInt('0b111111101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010'),
        BigInt('0b101010101010101010101010111111101010101010101010101010101010101010101010101010101010101010101010'),
        BigInt('0b101010101010101010101010101010101010101010101010111111101010101010101010101010101010101010101010'),
        BigInt('0b101010101010101010101010101010101010101010101010101010101010101010101010111111101010101010101010'),
      ];

      expect(state.set.d4(base, on)).toEqual(expected[0]);
      expect(state.set.d3(base, on)).toEqual(expected[1]);
      expect(state.set.d2(base, on)).toEqual(expected[2]);
      expect(state.set.d1(base, on)).toEqual(expected[3]);
    });
  });

  xdescribe('Input parsing', () => {
    test.each([
      [example1],
      [input],
    ])('%p => %p', (given) => {
      const [map, initialState] = parseInput(given);
      expect(stringify(map, initialState, false)).toEqual(given.trim());
    });
  });

  xdescribe('Example Steps', () => {
    const steps = [
      `
      #############
      #...........#
      ###B#C#B#D###
        #A#D#C#A#
        #########
      `,
      `
      #############
      #...B.......#
      ###B#C#.#D###
        #A#D#C#A#
        #########
      `,
      `
      #############
      #...B.C.....#
      ###B#.#.#D###
        #A#D#C#A#
        #########
      `,
      `
      #############
      #...B.......#
      ###B#.#C#D###
        #A#D#C#A#
        #########
      `,
      `
      #############
      #...B.D.....#
      ###B#.#C#D###
        #A#.#C#A#
        #########
      `,
      `
      #############
      #.....D.....#
      ###B#.#C#D###
        #A#B#C#A#
        #########
      `,
      `
      #############
      #...B.D.....#
      ###.#.#C#D###
        #A#B#C#A#
        #########
      `,
      `
      #############
      #.....D.....#
      ###.#B#C#D###
        #A#B#C#A#
        #########
      `,
      `
      #############
      #.....D.D...#
      ###.#B#C#.###
        #A#B#C#A#
        #########
      `,
      `
      #############
      #.....D.D.A.#
      ###.#B#C#.###
        #A#B#C#.#
        #########
      `,
      `
      #############
      #.....D...A.#
      ###.#B#C#.###
        #A#B#C#D#
        #########
      `,
      `
      #############
      #.........A.#
      ###.#B#C#D###
        #A#B#C#D#
        #########
      `,
      `
      #############
      #...........#
      ###A#B#C#D###
        #A#B#C#D#
        #########
      `,
    ];

    describe('One step', () => {
      test.each([
        [0, 1, 0, 40],
        [1, 2, 40, 240],
        [2, 3, 240, 440],
        [3, 4, 440, 3440],
        [4, 5, 3440, 3470],
        [5, 6, 3470, 3490],
        [6, 7, 3490, 3510],
        [7, 8, 3510, 5510],
        [8, 9, 5510, 5513],
        [9, 10, 5513, 8513],
        [10, 11, 8513, 12513],
        [11, 12, 12513, 12521],
      ])('%p => %p = %p', (given, expected, baseCost, finalCost) => {
        const [initialState, stateCosts] = parseInput(steps[given]);
        const toCheck = [];
        stateCosts[initialState] = baseCost;

        searchStep(initialState, toCheck, stateCosts, {}, false);

        const [targetState] = parseInput(steps[expected]);
        expect(toCheck).toContain(targetState);
        expect(stateCosts[targetState]).toEqual(finalCost);
      });
    });

    // Run through the queue long enough to have covered every step, and expect
    // the final state to have been found at some point
    test('All steps', () => {
      const given = steps[0];
      const expected = steps[steps.length - 1];

      const [initialState, stateCosts] = parseInput(given);
      const toCheck = [];

      searchStep(initialState, toCheck, stateCosts, {}, false);

      let start = 0;
      for (let i = 0; i < steps.length; i += 1) {
        const end = toCheck.length;
        for (let j = start; j < end; j += 1) {
          searchStep(toCheck[j], toCheck, stateCosts, {}, false);
        }

        start = end;
      }

      const [targetState] = parseInput(expected);
      expect(toCheck).toContain(targetState);
    });
  });

  xdescribe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 12521],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    xdescribe('Solution', () => {
      // 12950 too high
      const knownSolution = 12530;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    xdescribe('Tests', () => {
      test.each([
        [example1, 44169],
      ])('%p => %p', (given, expected) => {
        expect(b(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 50492;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
