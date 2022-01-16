import circuitBreaker from '@lib/circuitBreaker';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

interface StateNode extends INode<number, number> { value: number }
type Spell = {
  cost: number,
  effect: (state: number) => number,
  onTurn?: (state: number) => number,
  canChoose: (state: number) => boolean,
};

const PLAYER_HP = 50;
const PLAYER_MANA = 500;

/*
  State values:

    Boss HP       58                            6 bits
  Player HP       50      no max, "max" 63      6 bits
  Player mana     500     no max, "max" 1024   10 bits
  Shield left     6 turns                       3 bits
  Poison left     6 turns                       3 bits
  Rechrg left     5 turns                       3 bits
                                              --------
                                               30 bits

  Rch Poi Shl Mana       P HP   B HP
  000 000 000 0000000000 000000 000000
*/

/* eslint-disable no-multi-spaces */
export const state: {
  get: Record<string, (s: number) => number>,
  getAll: (s: number) => Record<string, number>,
  update: Record<string, (s: number, v: number) => number>
} = {
  get: {
    bossHp: (s) =>             (s) & 0b111111,
    playerHp: (s) =>     (s >>> 6) & 0b111111,
    mana: (s) =>        (s >>> 12) & 0b1111111111,
    shield: (s) =>      (s >>> 22) & 0b111,
    poison: (s) =>      (s >>> 25) & 0b111,
    recharge: (s) =>    (s >>> 28) & 0b111,
  },
  getAll: (s) => Object.entries(state.get).reduce(
    (acc, [k, v]) => { acc[k] = v(s); return acc; },
    {} as Record<string, number>,
  ),
  update: {
    bossHp: (s, v) =>   (s & 0b1111111111111111111111111000000) | v,
    playerHp: (s, v) => (s & 0b1111111111111111111000000111111) | (v << 6),
    mana: (s, v) =>     (s & 0b1111111110000000000111111111111) | (v << 12),
    shield: (s, v) =>   (s & 0b1111110001111111111111111111111) | (v << 22),
    poison: (s, v) =>   (s & 0b1110001111111111111111111111111) | (v << 25),
    recharge: (s, v) => (s & 0b0001111111111111111111111111111) | (v << 28),
  },
};
/* eslint-enable no-multi-spaces */

const getInitialState = (bossHp: number): number => {
  let s = state.update.bossHp(0, bossHp);
  s = state.update.playerHp(s, PLAYER_HP);
  s = state.update.mana(s, PLAYER_MANA);

  return s;
};

const minZero = (n: number): number => (n > 0 ? n : 0);

export const SPELLS: Record<string, Spell> = {
  'Magic Missile': {
    cost: 53,
    // It instantly does 4 damage.
    // Could cast on any turn
    effect: (s) => state.update.bossHp(s, minZero(state.get.bossHp(s) - 4)),
    canChoose: () => true,
  },
  Drain: {
    cost: 73,
    // It instantly does 2 damage and heals you for 2 hit points.
    // _Should probably_ only cast if not full health
    effect: (s) => {
      let next = state.update.bossHp(s, minZero(state.get.bossHp(s) - 2));
      next = state.update.playerHp(next, state.get.playerHp(next) + 2);

      return next;
    },
    canChoose: (s) => state.get.playerHp(s) < PLAYER_HP,
  },
  Shield: {
    cost: 113,
    // It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
    // Cannot cast if already shielded
    effect: (s) => state.update.shield(s, 6),
    canChoose: (s) => !state.get.shield(s),
  },
  Poison: {
    cost: 173,
    // It starts an effect that lasts for 6 turns.
    // At the start of each turn while it is active, it deals the boss 3 damage.
    // Cannot cast if boss already poisoned
    effect: (s) => state.update.poison(s, 6),
    canChoose: (s) => !state.get.poison(s),
  },
  Recharge: {
    cost: 229,
    // It starts an effect that lasts for 5 turns.
    // At the start of each turn while it is active, it gives you 101 new mana.
    // Cannot cast if already recharging
    effect: (s) => state.update.recharge(s, 5),
    canChoose: (s) => !state.get.recharge(s),
  },
};

const ALL_SPELLS = Object.keys(SPELLS).sort((a, b) => SPELLS[a].cost - SPELLS[b].cost);

const parseInput = (input: string): { hp: number, damage: number } => {
  const [hp, damage] = input.match(/(\d+)/g)!;

  return {
    hp: parseInt(hp, 10),
    damage: parseInt(damage, 10),
  };
};

export const tickEffects = (s: number): number => {
  let next = s;

  const rechargeLeft = state.get.recharge(next);
  if (rechargeLeft) {
    next = state.update.mana(next, state.get.mana(next) + 101);
    next = state.update.recharge(next, rechargeLeft - 1);
  }

  const shieldLeft = state.get.shield(next);
  if (shieldLeft) {
    next = state.update.shield(next, shieldLeft - 1);
  }

  const poisonLeft = state.get.poison(next);
  if (poisonLeft) {
    next = state.update.bossHp(next, minZero(state.get.bossHp(next) - 3));
    next = state.update.poison(next, poisonLeft - 1);
  }

  return next;
};

const tickHard = (s: number): number => (
  state.update.playerHp(s, minZero(state.get.playerHp(s) - 1))
);

export const bossAttack = (s: number, damage: number): number => {
  const effectiveDamage = (state.get.shield(s)) ? damage - 7 : damage;
  return state.update.playerHp(s, minZero(state.get.playerHp(s) - effectiveDamage));
};

const isBossDead = (s: number): boolean => state.get.bossHp(s) === 0;
const isPlayerDead = (s: number): boolean => state.get.playerHp(s) === 0;

const play = (input: string, isHard = false): number => {
  const { hp, damage: BOSS_DAMAGE } = parseInput(input);
  const initialState = getInitialState(hp);

  const seenStates: Set<number> = new Set([initialState]);
  const toPlay: FibonacciHeap<number, number> = new FibonacciHeap();
  toPlay.insert(0, initialState);

  while (!toPlay.isEmpty()) {
    circuitBreaker(10000);
    const cur = toPlay.extractMinimum()! as StateNode;

    let next = cur.value;

    if (isHard) {
      next = tickHard(next);
      if (isPlayerDead(next)) {
        continue;
      }
    }

    next = tickEffects(next);
    if (isBossDead(next)) {
      return cur.key;
    }

    for (let i = 0; i < ALL_SPELLS.length; i += 1) {
      const choice = SPELLS[ALL_SPELLS[i]];
      if ((state.get.mana(next) < choice.cost) || !choice.canChoose(next)) {
        continue;
      }

      const manaSpent = cur.key + choice.cost;
      let branch = state.update.mana(next, state.get.mana(next) - choice.cost);

      branch = choice.effect(branch);
      branch = tickEffects(branch);
      if (isBossDead(branch)) {
        return manaSpent;
      }

      branch = bossAttack(branch, BOSS_DAMAGE);
      if (!isPlayerDead(branch) && !seenStates.has(branch)) {
        seenStates.add(branch);
        toPlay.insert(manaSpent, branch);
      }
    }
  }

  throw new Error('Player never won');
};

export const part1 = play;
export const part2 = (input: string): number => play(input, true);
