import { split } from '@lib/processing';

export const part1 = (input: string): string => {
  const lines = split(input);

  const names: Record<string, number> = {};

  lines.forEach((line) => {
    const [name, ...refs] = line.match(/([a-z]+)/g)!;
    names[name] = (names[name] || 0) + 1;

    for (let i = 0; i < refs.length; i += 1) {
      names[refs[i]] = (names[refs[i]] || 0) - 1;
    }
  });

  return Object.entries(names).filter((entry) => entry[1] > 0)[0][0];
};

type InitialTower = {
  name: string,
  weight: number,
  children: string[],
};

type Tower = {
  name: string,
  weight: number,
  depth?: number,
  parent?: Tower,
  children: Tower[],
};

export const part2 = (input: string): number => {
  const lines = split(input);

  const initialTowers: Record<string, InitialTower> = {};
  const seenChildren: string[] = [];

  // Create a dependency tree
  lines.forEach((line) => {
    const [name, ...refs] = line.match(/([a-z]+)/g)!;
    const [weight] = line.match(/\d+/)!;

    seenChildren.push(...refs);
    initialTowers[name] = { name, weight: parseInt(weight, 10), children: refs };
  });

  const base = Object.keys(initialTowers).filter((t) => !seenChildren.includes(t))[0];
  const towers: Record<string, Tower> = {};

  const processTowers = (t: string, depth = 0) => {
    towers[t] = {
      name: t,
      weight: initialTowers[t].weight,
      depth,
      children: [],
    };

    for (let i = 0; i < initialTowers[t].children.length; i += 1) {
      const k = initialTowers[t].children[i];
      processTowers(k, depth + 1);
      towers[t].children.push(towers[k]);
      towers[k].parent = towers[t];
    }
  };

  processTowers(base);

  const sumCache: Record<string, number> = {};
  const sumTower = (t: Tower): number => {
    if (sumCache[t.name]) { return sumCache[t.name]; }

    let sum = t.weight;

    for (let i = 0; i < t.children.length; i += 1) {
      const child = t.children[i];

      sum += sumTower(child);
    }

    sumCache[t.name] = sum;
    return sum;
  };

  // Find the deepest unbalanced tower
  const unbalanced: Tower[] = [];
  Object.values(towers).forEach((t) => {
    if (t.children.length === 0) { return; }

    const childSums = t.children.map((child) => sumTower(child));
    const unique = Array.from(new Set(childSums));

    if (unique.length === 1) { return; }

    unbalanced.push(t);
  });

  const target = unbalanced.sort((a, b) => b.depth! - a.depth!)[0];

  // Find the offset by which one child differs from the rest
  const childSums = target.children.map((c) => sumTower(c));

  for (let i = 0; i < childSums.length; i += 1) {
    const a = childSums[(i > 0) ? i - 1 : childSums.length - 1];
    const b = childSums[i];
    const c = childSums[(i < childSums.length - 1) ? i + 1 : 0];

    if (b !== a && b !== c) {
      const offset = b - a;

      return target.children[i].weight - offset;
    }
  }

  throw new Error('Unable to balance the towers');
};
