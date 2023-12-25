import { split } from '@lib/processing';

type Node = {
  id: string;
  neighbours: Set<Node>;
};

const connect = (a: Node, b: Node) => {
  a.neighbours.add(b);
  b.neighbours.add(a);
};

const disconnect = (a: Node, b: Node) => {
  a.neighbours.delete(b);
  b.neighbours.delete(a);
};

export const part1 = (input: string, cuts: [string, string][]): number => {
  const nodes: Map<string, Node> = new Map();

  const upsertNode = (id: string): Node => {
    if (!nodes.has(id)) {
      nodes.set(id, { id, neighbours: new Set() });
    }

    return nodes.get(id)!;
  };

  split(input).forEach((line) => {
    const [id, ...neighbours] = line.match(/(\w{3})/g)!;
    const node = upsertNode(id);

    for (const n of neighbours) {
      connect(node, upsertNode(n));
    }
  });

  for (const [a, b] of cuts) {
    disconnect(nodes.get(a)!, nodes.get(b)!);
  }

  const aStart = nodes.get(cuts[0][0])!;
  const aToVisit: Node[] = [aStart];
  const aSeen = new Set();

  while (aToVisit.length) {
    const cur = aToVisit.pop()!;

    for (const n of cur.neighbours) {
      if (!aSeen.has(n)) {
        aSeen.add(n);
        aToVisit.push(n);
      }
    }
  }

  return aSeen.size * (nodes.size - aSeen.size);
};
