import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

enum Side {
  'Immune System' = 'Immune System',
  'Infection' = 'Infection',
}

const otherSide: { [key in Side]: Side } = {
  [Side['Immune System']]: Side.Infection,
  [Side.Infection]: Side['Immune System'],
};

enum DamageType {
  radiation = 'radiation',
  fire = 'fire',
  slashing = 'slashing',
  bludgeoning = 'bludgeoning',
  cold = 'cold',
}

class Group {
  side: Side;
  count: number;
  hp: number;
  damage: number;
  type: DamageType;
  initiative: number;
  weaknesses: Set<DamageType>;
  immunities: Set<DamageType>;

  constructor(side: Side, line: string, boost: number) {
    this.side = side;

    const [, count, hp, defenseTypes, damage, type, initiative] = line.match(/^(\d+) units each with (\d+) hit points(.*)with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)$/)!;

    this.count = parseInt(count, 10);
    this.hp = parseInt(hp, 10);
    this.damage = parseInt(damage, 10);

    if (side === Side['Immune System']) {
      this.damage += boost;
    }

    this.type = DamageType[type as DamageType];
    this.initiative = parseInt(initiative, 10);

    this.weaknesses = new Set();
    this.immunities = new Set();

    if (defenseTypes.length) {
      const weaknesses = defenseTypes.match(/weak to ([a-z, ]+)[;)]/);
      if (weaknesses) {
        weaknesses[1].split(', ').forEach((w) => {
          this.weaknesses.add(DamageType[w as DamageType]);
        });
      }

      const immunities = defenseTypes.match(/immune to ([a-z, ]+)[;)]/);
      if (immunities) {
        immunities[1].split(', ').forEach((i) => {
          this.immunities.add(DamageType[i as DamageType]);
        });
      }
    }
  }

  get power() {
    return this.count * this.damage;
  }

  determineUnitLoss(target: Group, baseDamage: number): number {
    const netDamage = baseDamage * this.count;

    return Math.floor(netDamage / target.hp);
  }

  takeLosses(units: number) {
    this.count -= units;

    if (this.count < 0) {
      this.count = 0;
    }
  }
}

const parseInput = (input: string, boost: number): Group[] => {
  const sides = split(input, '\n\n');

  const groups: Group[] = [];

  sides.forEach((s) => {
    const lines = s.split('\n');
    const side = Side[lines[0].replace(':', '') as Side];

    for (let i = 1; i < lines.length; i += 1) {
      groups.push(new Group(side, lines[i], boost));
    }
  });

  return groups;
};

/*
  For each Group, return a list of [Opposing Group, base damage to that group],
  ordered by highest damage
*/
const mapTargets = (sides: { [key in Side]: Group[] }): Map<Group, [Group, number][]> => {
  const favored = new Map();

  // eslint-disable-next-line guard-for-in
  for (const k in sides) {
    const s = sides[k as Side];
    const os = sides[otherSide[k as Side]];

    s.forEach((g) => {
      const groupDamages: [Group, number][] = [];

      os.forEach((t) => {
        let { damage } = g;
        const { type } = g;

        if (t.weaknesses.has(type)) {
          damage *= 2;
        } else if (t.immunities.has(type)) {
          damage = 0;
        }

        groupDamages.push([t, damage]);
      });

      groupDamages.sort((a, b) => b[1] - a[1]);

      favored.set(g, groupDamages);
    });
  }

  return favored;
};

const checkEndState = (groups: Group[]): [Side, number] | null => {
  const counts = { [Side['Immune System']]: 0, [Side.Infection]: 0 };

  groups.forEach((g) => { counts[g.side] += g.count; });

  if (counts[Side['Immune System']] <= 0) {
    return [Side.Infection, counts[Side.Infection]];
  }

  if (counts[Side.Infection] <= 0) {
    return [Side['Immune System'], counts[Side['Immune System']]];
  }

  return null;
};

const resolveEqualTargets = (a: Group, b: Group): Group => {
  if (a.power > b.power) { return a; }
  if (b.power > a.power) { return b; }
  if (a.initiative > b.initiative) { return a; }
  return b;
};

const run = (input: string, boost: number = 0): [Side, number] | null => {
  const groups = parseInput(input, boost);

  const byPower = [...groups];
  const byInitiative = [...groups].sort((a, b) => b.initiative - a.initiative);

  const sides = groups.reduce((acc, cur) => {
    acc[cur.side].push(cur);
    return acc;
  }, { [Side['Immune System']]: [] as Group[], [Side.Infection]: [] as Group[] });

  const targetingMap = mapTargets(sides);

  const breaker = new CircuitBreaker(10000);

  let endState = null;

  // It's possible to get into a state where nobody can damage anyone else
  let stalemate = false;
  while (!endState && !stalemate) {
    breaker.tick(groups);

    // Selection
    // Order by eff. power, initiative high to low
    byPower.sort((a, b) => {
      if (a.power !== b.power) {
        return b.power - a.power;
      }

      return b.initiative - a.initiative;
    });

    // <Attacker, [Target, baseDamage]>
    const attacking: Map<Group, [Group, number]> = new Map();
    const targeted: Set<Group> = new Set();

    // For each group
    byPower.forEach((g) => {
      // This group is dead
      if (g.count <= 0) { return; }

      let currentTarget: [Group, number] | null = null;

      const targets = targetingMap.get(g)!;
      // Target group that it would damage the most (per dmg + weak + imm),
      // not counting how much hp they have. Break ties by > current power
      for (let i = 0; i < targets.length; i += 1) {
        const [t, baseDamage] = targets[i];

        // There's nobody we can damage in this iteration
        if (baseDamage === 0) {
          break;
        }

        // This target is already dead, already being attacked, or we can't kill
        // even one unit
        if (t.count <= 0 || targeted.has(t)) { // || !g.determineUnitLoss(t, baseDamage)) {
          continue;
        }

        if (!currentTarget) {
          currentTarget = targets[i];
          continue;
        }

        // We've checked all possible ties for base damage
        if (baseDamage < currentTarget[1]) {
          break;
        }

        // It's a tie; resolve by > eff. power, > initiative
        if (currentTarget) {
          const resolved = resolveEqualTargets(currentTarget[0], t);
          // console.log({
          //   current: currentTarget[0],
          //   next: t,
          //   resolved,
          // });
          currentTarget = [resolved, baseDamage];
        }
      }

      // If there are no available targets, does not attack
      if (currentTarget) {
        targeted.add(currentTarget[0]);
        attacking.set(g, currentTarget);
      }
    });

    let damageDealt = false;

    // Attacking
    // Order by initiative, high to low
    byInitiative.forEach((g) => {
      // This group was killed this turn
      if (g.count <= 0) {
        return;
      }

      const attack = attacking.get(g);

      if (attack) {
        const losses = g.determineUnitLoss(attack[0], attack[1]);

        if (losses) {
          damageDealt = true;
        }

        attack[0].takeLosses(losses);
      }
    });

    if (!damageDealt) {
      stalemate = true;
    }

    // Damage = effective power
    // Weak = 2x damage
    // Immune = 0 damage

    // Kills Math.floor(attacker.power / target.hp) units ?

    endState = checkEndState(groups);
  }

  return endState;
};

export const part1 = (input: string): number => {
  const endState = run(input);

  return endState![1];
};

export const part2 = (input: string): number => {
  let min = 1;
  let max = 0.5;

  let endState;
  while (endState?.[0] !== Side['Immune System']) {
    max *= 2;

    endState = run(input, max);
  }

  min = max / 2;

  for (let i = min + 1; i < max; i += 1) {
    endState = run(input, i);

    if (endState?.[0] === Side['Immune System']) {
      break;
    }
  }

  return endState![1];
};
