import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { IntCode } from '../IntCode';
import { part1, part2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test('Input and output', () => {
        const ic = new IntCode('3,0,4,0,99', { input: [42] });
        ic.run();

        expect(ic.output).toEqual([42]);
      });

      test('Immediate mode', () => {
        const ic = new IntCode('1002,4,3,4,33');
        const state = ic.run();

        expect(state[4]).toEqual(99);
      });
    });

    describe('Solution', () => {
      const knownSolution = 7259358;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests - Jump and Comparison', () => {
      test.each([
        // =8, position
        ['3,9,8,9,10,9,4,9,99,-1,8', [8], 1],
        ['3,9,8,9,10,9,4,9,99,-1,8', [7], 0],

        // <8, position
        ['3,9,7,9,10,9,4,9,99,-1,8', [8], 0],
        ['3,9,7,9,10,9,4,9,99,-1,8', [7], 1],

        // =8, immediate
        ['3,3,1108,-1,8,3,4,3,99', [8], 1],
        ['3,3,1108,-1,8,3,4,3,99', [7], 0],

        // <8, immediate
        ['3,3,1107,-1,8,3,4,3,99', [8], 0],
        ['3,3,1107,-1,8,3,4,3,99', [7], 1],

        // =0, position
        ['3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', [3], 1],
        ['3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', [0], 0],

        // =0, immediate
        ['3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [3], 1],
        ['3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [0], 0],

        // <=>8
        [
          '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99',
          [7],
          999,
        ],
        [
          '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99',
          [8],
          1000,
        ],
        [
          '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99',
          [9],
          1001,
        ],
      ])('%p => %p', (given, inputArgs, expected) => {
        const ic = new IntCode(given, { input: inputArgs });
        ic.run();

        const [received] = ic.output;
        expect(received).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 11826654;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
