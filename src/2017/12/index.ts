import { split } from '@lib/processing';

type Node = { children: Node[] };

const parseInput = (input: string): Record<string, Node> => {
  const nodes: Record<string, Node> = {};
  split(input).forEach((line) => {
    const [node, ...edges] = line.match(/\d+/g)!;

    if (!nodes[node]) {
      nodes[node] = { children: [] };
    }

    edges.forEach((e) => {
      if (!nodes[e]) { nodes[e] = { children: [] }; }
      nodes[node].children.push(nodes[e]);
    });
  });

  return nodes;
};

export const part1 = (input: string): number => {
  const nodes = parseInput(input);

  const seen: Set<Node> = new Set([nodes[0]]);
  const toCheck: Node[] = [nodes[0]];

  while (toCheck.length) {
    const cur = toCheck.pop()!;

    cur.children.forEach((c) => {
      if (!seen.has(c)) {
        seen.add(c);
        toCheck.push(...c.children);
      }
    });
  }

  return seen.size;
};

export const part2 = (input: string): number => {
  const nodes = parseInput(input);

  let groups = 0;
  let base: Node | null = nodes[0];

  const seen: Set<Node> = new Set([base]);

  let lastFound = -1;
  const nodeValues = Object.values(nodes);
  const findNextBase = (): Node | null => {
    for (let i = lastFound + 1; i < nodeValues.length; i += 1) {
      if (!seen.has(nodeValues[i])) {
        lastFound = i;
        return nodeValues[i];
      }
    }

    return null;
  };

  while (base) {
    groups += 1;

    const toCheck: Node[] = [base];
    while (toCheck.length) {
      const cur = toCheck.pop()!;

      cur.children.forEach((c) => {
        if (!seen.has(c)) {
          seen.add(c);
          toCheck.push(...c.children);
        }
      });
    }

    base = findNextBase();
  }

  return groups;
};
