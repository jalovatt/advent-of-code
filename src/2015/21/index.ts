type Item = { name: string, cost: number, damage: number, armor: number };
type Result = { cost: number, result: boolean };

const WEAPONS: Item[] = [
  { name: 'Dagger', cost: 8, damage: 4, armor: 0 },
  { name: 'Shortsword', cost: 10, damage: 5, armor: 0 },
  { name: 'Warhammer', cost: 25, damage: 6, armor: 0 },
  { name: 'Longsword', cost: 40, damage: 7, armor: 0 },
  { name: 'Greataxe', cost: 74, damage: 8, armor: 0 },
];

const ARMOR: Item[] = [
  { name: 'None', cost: 0, damage: 0, armor: 0 },
  { name: 'Leather', cost: 13, damage: 0, armor: 1 },
  { name: 'Chainmail', cost: 31, damage: 0, armor: 2 },
  { name: 'Splintmail', cost: 53, damage: 0, armor: 3 },
  { name: 'Bandedmail', cost: 75, damage: 0, armor: 4 },
  { name: 'Platemail', cost: 102, damage: 0, armor: 5 },
];

const RINGS: Item[] = [
  { name: 'None', cost: 0, damage: 0, armor: 0 },
  { name: 'Damage +1', cost: 25, damage: 1, armor: 0 },
  { name: 'Damage +2', cost: 50, damage: 2, armor: 0 },
  { name: 'Damage +3', cost: 100, damage: 3, armor: 0 },
  { name: 'Defense +1', cost: 20, damage: 0, armor: 1 },
  { name: 'Defense +2', cost: 40, damage: 0, armor: 2 },
  { name: 'Defense +3', cost: 80, damage: 0, armor: 3 },
  { name: 'None', cost: 0, damage: 0, armor: 0 },
];

const PLAYER_HP = 100;

/*
Hit Points: 104
Damage: 8
Armor: 1
*/
type Entity = { hp: number, damage: number, armor: number };
const parseInput = (input: string): Entity => {
  const [hp, damage, armor] = input.match(/(\d+)/g)!;

  return {
    hp: parseInt(hp, 10),
    damage: parseInt(damage, 10),
    armor: parseInt(armor, 10),
  };
};

export const fight = (player: Entity, boss: Entity): boolean => {
  const fighters = [player, boss];
  let turn = 0;

  while (true) {
    const attacker = fighters[turn];
    const defender = fighters[1 - turn];

    defender.hp -= (attacker.damage - defender.armor);
    if (defender.hp <= 0) {
      return (defender === boss);
    }

    turn ^= 1;
  }
};

const getCost = (w: number, a: number, r1: number, r2: number): number => (
  WEAPONS[w].cost + ARMOR[a].cost + RINGS[r1].cost + RINGS[r2].cost
);

const getResults = (input: string): Result[] => {
  const boss = parseInput(input);
  const BOSS_HP = boss.hp;

  const player: Entity = { hp: 0, damage: 0, armor: 0 };

  const results = [];
  for (let w = 0; w < WEAPONS.length; w += 1) {
    for (let a = 0; a < ARMOR.length; a += 1) {
      for (let r1 = 0; r1 < RINGS.length - 2; r1 += 1) {
        // This garbage makes sure we get every combination of 0-2 rings once
        for (let r2 = r1 + 1; r2 < (r1 > 0 ? RINGS.length - 1 : RINGS.length); r2 += 1) {
          player.hp = PLAYER_HP;
          player.damage = WEAPONS[w].damage + RINGS[r1].damage + RINGS[r2].damage;
          player.armor = ARMOR[a].armor + RINGS[r1].armor + RINGS[r2].armor;

          // Cloning to reset the boss's HP
          boss.hp = BOSS_HP;
          const result = fight(player, boss);
          results.push({
            cost: getCost(w, a, r1, r2),
            result,
          });
        }
      }
    }
  }

  return results;
};
export const part1 = (input: string): number => getResults(input)
  .filter((r) => r.result).sort((a, b) => a.cost - b.cost)[0].cost;

export const part2 = (input: string): number => getResults(input)
  .filter((r) => !r.result).sort((a, b) => b.cost - a.cost)[0].cost;
