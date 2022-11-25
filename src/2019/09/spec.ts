import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { IntCode } from '../IntCode';

const title = 'Sensor Boost';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests - Relative Mode', () => {
      test('quine', () => {
        const inputStr = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
        const ic = new IntCode(inputStr);
        ic.run();

        expect(ic.output.join(',')).toEqual(inputStr);
      });

      test('16-digit number', () => {
        const ic = new IntCode('1102,34915192,34915192,7,4,7,99,0');
        ic.run();

        expect(ic.output[0].toString(10)).toHaveLength(16);
      });

      test('large number', () => {
        const ic = new IntCode('104,1125899906842624,99');
        ic.run();

        expect(ic.output[0]).toEqual(1125899906842624);
      });
    });

    describe('Solution', () => {
      const knownSolution = 4080871669;

      test(`${knownSolution}`, () => {
        const ic = new IntCode(input, { input: [1] });
        ic.run();

        expect(ic.output).toHaveLength(1);
        expect(ic.output[0]).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 75202;

      test(`${knownSolution}`, () => {
        const ic = new IntCode(input, { input: [2] });
        ic.run();

        expect(ic.output).toHaveLength(1);
        expect(ic.output[0]).toEqual(knownSolution);
      });
    });
  });
});
