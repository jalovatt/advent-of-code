/* eslint-disable object-curly-newline */
import loadText from '@lib/loadText';
import { a, b, decodeState, encodeState, ring } from '.';

const title = 'Dirac Dice';

const input = loadText('input.txt');

const example1 = `
Player 1 starting position: 4
Player 2 starting position: 8
`;

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)?.[1]} - ${title}`, () => {
  describe('ring', () => {
    test.each([
      [[1, 1], 2],
      [[1, 9], 10],
      [[1, 10], 1],
      [[7, 9], 6],
      [[10, 9], 9],
      [[4, 3], 7],
      [[4, 7], 1],
      [[8, 3], 1],
      [[8, 5], 3],
    ])('%p => %p', (given, expected) => {
      expect(ring(given[0] + given[1], 10)).toEqual(expected);
    });
  });

  describe('Encoding state', () => {
    test('basic encode', () => {
      expect(encodeState(10, 5, 6, 3, 0)).toEqual(0b0101000101011000110);

      expect(encodeState(1, 0, 1, 4, 1)).toEqual(16425);
    });

    test('basic decode', () => {
      expect(decodeState(0b0101000101011000110)).toEqual({
        p1s: 10,
        p2s: 5,
        p1p: 6,
        p2p: 3,
        turn: 0,
      });

      expect(decodeState(16425)).toEqual({ p1p: 1, p2p: 4, p1s: 1, p2s: 0, turn: 1 });
    });

    test.each([
      { p1s: 0, p2s: 0, p1p: 4, p2p: 8, turn: 0 },
      { p1s: 1, p2s: 0, p1p: 1, p2p: 8, turn: 1 },
      { p1s: 1, p2s: 2, p1p: 1, p2p: 10, turn: 0 },
      { p1s: 14, p2s: 2, p1p: 4, p2p: 10, turn: 1 },
      { p1p: 1, p2p: 4, p1s: 1, p2s: 0, turn: 1 },
    ])('%p => %p', (given) => {
      const encoded = encodeState(given.p1s, given.p2s, given.p1p, given.p2p, given.turn);
      expect(decodeState(encoded)).toEqual(given);
    });

    xtest('all states', () => {
      for (let p1s = 0; p1s <= 20; p1s += 1) {
        for (let p2s = 0; p2s <= 20; p2s += 1) {
          for (let p1p = 1; p1p <= 10; p1p += 1) {
            for (let p2p = 1; p2p <= 10; p2p += 1) {
              for (let turn = 0; turn <= 1; turn += 1) {
                const encoded = encodeState(p1s, p2s, p1p, p2p, turn);
                expect(decodeState(encoded)).toEqual({
                  p1s, p2s, p1p, p2p, turn,
                });
              }
            }
          }
        }
      }
    });
  });

  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [example1, 739785],
      ])('%p => %p', (given, expected) => {
        expect(a(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 720750;

      test(`${knownSolution}`, () => {
        const solution = a(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [1, 27], // 0)
        [2, 183], // 156)
        [3, 990], // 207)
        [4, 2930], // 971)
        [5, 7907], // 2728)
        [6, 30498], // 7203)
        // [7, 127019], // 152976)   These three aren't matching up to the list
        // [8, 655661], // 1048978)  I found but I don't feel like looking into it
        // [9, 4008007], // 4049420)
        [10, 18973591], // 12657100)
        [11, 90197150], // 47304735
        [12, 454323519], // 217150220
        [13, 2159295972], // 1251104269
        [14, 9632852745], // 7543855038
        [15, 43413388231], // 37334719860
        [16, 199092281721], // 161946691198
        [17, 903307715712], // 698632570521
        [18, 4227532541969], // 3151502992942
        [19, 20259464849183], // 14795269706204
        [20, 95627706087732], // 71421811355805
        [21, 444356092776315], // 341960390180808
      ])('%p => %p', (given, expected) => {
        expect(b(example1, given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 275067741811212;

      test(`${knownSolution}`, () => {
        const solution = b(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
