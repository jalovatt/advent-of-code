import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { bossAttack, part1, part2, SPELLS, state, tickEffects } from '.';

const title = 'Wizard Simulator 20XX';

const input = loadText('input.txt');

describeDay(title, () => {
  describe('State', () => {
    describe('get', () => {
      test.each([
        ['bossHp', 0b0, 0],
        ['bossHp', 0b000001, 1],
        ['bossHp', 0b000010, 2],
        ['bossHp', 0b000110, 6],
        ['playerHp', 0b0, 0],
        ['playerHp', 0b000001000000, 1],
        ['playerHp', 0b000010000000, 2],
        ['playerHp', 0b000110000000, 6],
        ['mana', 0b0, 0],
        ['mana', 0b0000000001000000000000, 1],
        ['mana', 0b0111110100000000000000, 500],
        ['mana', 0b1111111111000000000000, 1023],
        ['shield', 0b0, 0],
        ['shield', 0b0010000000000000000000000, 1],
        ['shield', 0b0100000000000000000000000, 2],
        ['shield', 0b1100000000000000000000000, 6],
        ['poison', 0b0, 0],
        ['poison', 0b0010000000000000000000000000, 1],
        ['poison', 0b0100000000000000000000000000, 2],
        ['poison', 0b1100000000000000000000000000, 6],
        ['recharge', 0b0, 0],
        ['recharge', 0b0010000000000000000000000000000, 1],
        ['recharge', 0b0100000000000000000000000000000, 2],
        ['recharge', 0b1100000000000000000000000000000, 6],
      ] as [string, number, number][])('%p: %p = %p', (prop, given, expected) => {
        expect(state.get[prop](given)).toEqual(expected);
      });
    });

    describe('update', () => {
      test.each([
        ['bossHp', 0b0, 0, 0],
        ['bossHp', 0b000001, 2, 0b000010],
        ['bossHp', 0b000010, 4, 0b000100],
        ['bossHp', 0b000110, 4, 0b000100],
        ['playerHp', 0b0, 0, 0],
        ['playerHp', 0b000001000000, 2, 0b000010000000],
        ['playerHp', 0b000010000000, 4, 0b000100000000],
        ['playerHp', 0b000110000000, 3, 0b000011000000],
        ['mana', 0b0, 0, 0],
        ['mana', 0b0000000001000000000000, 65, 0b001000001000000000000],
        ['mana', 0b0001000001000000000000, 500, 0b0111110100000000000000],
        ['mana', 0b1111111111000000000000, 512, 0b1000000000000000000000],
        ['shield', 0b0, 0, 0],
        ['shield', 0b0010000000000000000000000, 2, 0b0100000000000000000000000],
        ['shield', 0b0100000000000000000000000, 6, 0b1100000000000000000000000],
        ['shield', 0b1100000000000000000000000, 1, 0b0010000000000000000000000],
        ['poison', 0b0, 0, 0],
        ['poison', 0b0010000000000000000000000000, 2, 0b0100000000000000000000000000],
        ['poison', 0b0100000000000000000000000000, 6, 0b1100000000000000000000000000],
        ['poison', 0b1100000000000000000000000000, 1, 0b0010000000000000000000000000],
        ['recharge', 0b0, 0, 0],
        ['recharge', 0b0010000000000000000000000000000, 2, 0b0100000000000000000000000000000],
        ['recharge', 0b0100000000000000000000000000000, 6, 0b1100000000000000000000000000000],
        ['recharge', 0b1100000000000000000000000000000, 1, 0b0010000000000000000000000000000],
      ] as [string, number, number, number][])('%p: %p => %p = %p', (prop, given, updated, expected) => {
        expect(state.update[prop](given, updated)).toEqual(expected);
      });

      describe('effects', () => {
        /*
          0001010000000110000001110011101
          000 101 000 0000110000 001110 011101
            0   5   0         48     14     29

            + Magic Missile   -4 boss
            + Poison tick     -3 boss, -1 poison
            + Boss attacks    -9 player
            + Poison tick     -3 boss, -1 poison

          0b0000110000000110000000101010011
        */
        test.each([
          [
            0b0001010000000110000001110011101,
            SPELLS['Magic Missile'].effect,
            0b0001010000000110000001110011001,
          ],
          [
            0b0001010000000110000001110011001,
            tickEffects,
            0b0001000000000110000001110010110,
          ],
          [
            0b0001000000000110000001110010110,
            (s) => bossAttack(s, 9),
            0b0001000000000110000000101010110,
          ],
          [
            0b0001000000000110000000101010110,
            tickEffects,
            0b0000110000000110000000101010011,
          ],
        ] as [number, (s: number) => number, number][])('%p: %p => %p', (given, effect, expected) => {
          expect(effect(given)).toEqual(expected);
        });
      });
    });
  });

  describe('Part 1', () => {
    describe('Solution', () => {
      const knownSolution = 1269;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const knownSolution = 1309;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
