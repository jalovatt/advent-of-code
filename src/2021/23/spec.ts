import { FibonacciHeap } from '@tyriar/fibonacci-heap';
import loadText from '@lib/loadText';
import { a, b, parseInput, searchStep } from './index';
import type { StateNode, StateNodes } from './index';

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
  describe('Example Steps', () => {
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
        const initialState = parseInput(steps[given]);
        const toCheck: FibonacciHeap<number, string> = new FibonacciHeap();
        const stateNodes: StateNodes = {};
        stateNodes[initialState] = toCheck.insert(baseCost, initialState) as StateNode;

        searchStep(
          toCheck.extractMinimum() as { key: number, value: string },
          toCheck,
          stateNodes,
          false,
        );

        const targetState = parseInput(steps[expected]);
        expect(stateNodes[targetState]).toBeDefined();
        expect(stateNodes[targetState].key).toEqual(finalCost);
      });
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 12521],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      // 12950 too high
      const knownSolution = 12530;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
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
