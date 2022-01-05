import loadText from '@lib/loadText';
import { testParsing, a, b } from '.';

const title = 'Packet Decoder';

const input = loadText('input.txt');

const example1 = `
110100101111111000101000
`;
// VVVTTTAAAAABBBBBCCCCC

const example2 = `
00111000000000000110111101000101001010010001001000000000
`;
// VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB

const example3 = `
11101110000000001101010000001100100000100011000001100000
`;
// VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC

const example4 = `
8A004A801A8002F478
`;

const example5 = `
620080001611562C8802118E34
`;

const example6 = `
C0015000016115A2E0802F182340
`;

const example7 = `
A0016C880162017C3686B18A3D4780
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('Parsing', () => {
    test.each([
      [example1, {
        version: 6,
        type: 4,
        value: 2021,
      }],
      [example2, {
        version: 1,
        type: 6,
        children: [
          expect.objectContaining({ version: 6, type: 4, value: 10 }),
          expect.objectContaining({ version: 2, type: 4, value: 20 }),
        ],
      }],
      [example3, {
        version: 7,
        type: 3,
        children: [
          expect.objectContaining({ version: 2, type: 4, value: 1 }),
          expect.objectContaining({ version: 4, type: 4, value: 2 }),
          expect.objectContaining({ version: 1, type: 4, value: 3 }),
        ],
      }],
    ])('%p => %p', (given, expected) => {
      expect(testParsing(given)).toEqual(expect.objectContaining(expected));
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example4, 16],
        [example5, 12],
        [example6, 23],
        [example7, 31],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 969;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['C200B40A82', 3],
        ['04005AC33890', 54],
        ['880086C3E88112', 7],
        ['CE00C43D881120', 9],
        ['D8005AC2A8F0', 1],
        ['F600BC2D8F', 0],
        ['9C005AC2F8F0', 0],
        ['9C0141080250320F1802104A08', 1],
      ])('%p => %p', (given, expected) => {
        expect(b(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 124921618408;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
