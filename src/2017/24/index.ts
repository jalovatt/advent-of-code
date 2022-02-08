import { split } from '@lib/processing';

type Component = { a: number, b: number, isDouble?: boolean };
type Bridge = { end: number, strength: number, components: Set<Component> };

const unusedPort = (c: Component, last: number): number => (c.a === last ? c.b : c.a);
const sumComponent = (c: Component): number => c.a + c.b;

const getBridges = (input: string): Bridge[] => {
  const components: Component[] = split(input).map((line) => {
    const c = line.split('/').map((n) => parseInt(n, 10));

    return { a: c[0], b: c[1], isDouble: c[0] === c[1] };
  });

  const byPort: Map<number, Component[]> = new Map();
  components.forEach((c) => {
    let arr0 = byPort.get(c.a);

    if (!arr0) {
      arr0 = [];
      byPort.set(c.a, arr0);
    }

    arr0.push(c);

    if (c.a === c.b) { return; }

    let arr1 = byPort.get(c.b);

    if (!arr1) {
      arr1 = [];
      byPort.set(c.b, arr1);
    }

    arr1.push(c);
  });

  const bridges: Bridge[] = [];

  const toCheck: Bridge[] = byPort.get(0)!.map((c) => ({
    components: new Set([c]),
    end: unusedPort(c, 0),
    strength: sumComponent(c),
  }));

  const enqueue = (next: Component, bridge: Bridge) => {
    const nextComponents = new Set(bridge.components).add(next);
    toCheck.push({
      components: nextComponents,
      end: unusedPort(next, bridge.end),
      strength: bridge.strength + sumComponent(next),
    });
  };

  while (toCheck.length) {
    const cur = toCheck.pop()!;
    const possible = byPort.get(cur.end);

    if (!possible) {
      bridges.push(cur);
      continue;
    }

    const available = possible.filter((p) => (
      (p.a === cur.end || p.b === cur.end) && !cur.components.has(p)
    ));

    if (!available.length) {
      bridges.push(cur);
      continue;
    }

    /*
      Take doubles as soon as possible, since they don't affect the remaining
      choices and significantly reduce the number of branches, bringing the
      runtime down from ~1.5s to 0.3s. Thanks, Reddit.
    */
    const availableDouble = available.find((c) => (
      c.isDouble && (c.a === cur.end || c.b === cur.end)
    ));

    if (availableDouble) {
      enqueue(availableDouble, cur);

      continue;
    }

    for (let i = 0; i < available.length; i += 1) {
      enqueue(available[i], cur);
    }
  }

  return bridges;
};

export const part1 = (input: string): number => {
  const bridges = getBridges(input);

  return bridges.sort((a, b) => b.strength - a.strength)[0].strength;
};

export const part2 = (input: string): number => {
  const bridges = getBridges(input);

  const sorted = bridges.sort((a, b) => {
    if (a.components.size !== b.components.size) { return b.components.size - a.components.size; }

    return b.strength - a.strength;
  });

  return sorted[0].strength;
};
