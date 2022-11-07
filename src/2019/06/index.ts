import { split } from '@lib/processing';

type Node = { parent?: Node, depth: number, children: Node[] };

const buildNodes = (input: string): Record<string, Node> => {
  const nodes: Record<string, Node> = { COM: { depth: 0, children: [] } };

  const unvisited = split(input);

  while (unvisited.length) {
    const cur = unvisited.pop()!;
    const [inner, outer] = cur.split(')');

    if (!nodes[inner]) {
      unvisited.unshift(cur);
    } else {
      const parent = nodes[inner];
      const node = { depth: parent.depth + 1, parent: nodes[inner], children: [] };

      parent.children.push(node);
      nodes[outer] = node;
    }
  }

  return nodes;
};

export const part1 = (input: string): number => {
  const nodes = buildNodes(input);

  return Object.values(nodes).reduce((acc, cur) => acc + cur.depth, 0);
};

export const part2 = (input: string): number => {
  const nodes = buildNodes(input);
  const myPath: Set<Node> = new Set();

  let cur = nodes.YOU;
  while (cur.parent) {
    cur = cur.parent;
    myPath.add(cur);
  }

  cur = nodes.SAN;
  while (cur.parent && !myPath.has(cur)) {
    cur = cur.parent;
  }

  return (nodes.YOU.depth - cur.depth - 1) + (nodes.SAN.depth - cur.depth - 1);
};
