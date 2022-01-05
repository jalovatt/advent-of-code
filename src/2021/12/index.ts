/* eslint-disable max-classes-per-file */
import { split } from '../../utilities/processing';
import circuitBreaker from '../../utilities/circuitBreaker';

class Node {
  value: string;
  isLarge: boolean;
  edges: Array<Node>;

  constructor(value: string) {
    this.value = value;
    this.isLarge = (value.toUpperCase() === value);
    this.edges = [];
  }

  connect(node: Node) {
    this.edges.push(node);
    node.edges.push(this);
  }
}

const getObjWithDefaultNode = (): { [key: string]: Node } => (
  new Proxy({} as { [key: string]: Node }, {
    // eslint-disable-next-line no-param-reassign
    get: (t, p: string) => { if (!t[p]) { t[p] = new Node(p); } return t[p]; },
  })
);

const getNodes = (entries: string[][]): [Node, Node] => {
  const nodesByString = getObjWithDefaultNode();

  let start: Node;
  let end: Node;

  entries.forEach(([left, right]) => {
    const leftNode = nodesByString[left];
    const rightNode = nodesByString[right];
    leftNode.connect(rightNode);

    if (!start) {
      if (left === 'start') {
        start = leftNode;
      } else if (right === 'start') {
        start = rightNode;
      }
    }

    if (!end) {
      if (left === 'end') {
        end = leftNode;
      } else if (right === 'end') {
        end = rightNode;
      }
    }
  });

  return [start!, end!];
};

class NodeVisitor {
  node: Node;
  visitedCount: Map<Node, number>;
  hasExtraVisit: boolean;

  constructor(node: Node, visitedCount: Map<Node, number>, hasExtraVisit = false) {
    this.node = node;
    this.visitedCount = new Map(visitedCount);
    this.visitedCount.set(node, (this.visitedCount.get(node) || 0) + 1);
    this.hasExtraVisit = hasExtraVisit;
  }

  visit(): { edge: Node, hasExtraVisit: boolean }[] {
    const out = [];

    for (let i = 0; i < this.node.edges.length; i += 1) {
      const edge = this.node.edges[i];
      const visitedTimes = this.visitedCount.get(edge);

      if (edge.isLarge || !visitedTimes) {
        out.push({ edge, hasExtraVisit: this.hasExtraVisit });
      } else if (visitedTimes === 1 && this.hasExtraVisit) {
        out.push({ edge, hasExtraVisit: false });
      }
    }

    return out;
  }
}

const findDistinctPaths = (start: Node, end: Node, allowExtraVisit = false): number => {
  const toVisit = [new NodeVisitor(start, new Map(), allowExtraVisit)];

  let pathsCount = 0;

  while (toVisit.length) {
    const cur = toVisit.pop()!;

    const next = cur.visit();

    for (let i = 0; i < next.length; i += 1) {
      const choice = next[i];
      if (choice.edge === end) {
        pathsCount += 1;
      } else if (choice.edge !== start) {
        toVisit.push(
          new NodeVisitor(choice.edge, cur.visitedCount, choice.hasExtraVisit),
        );
      }
    }

    circuitBreaker(500000);
  }

  return pathsCount;
};

export const a = (input: string) => {
  const entries = split(input).map((line) => line.split('-'));
  const [start, end] = getNodes(entries);

  return findDistinctPaths(start, end);
};

export const b = (input: string) => {
  const entries = split(input).map((line) => line.split('-'));
  const [start, end] = getNodes(entries);

  return findDistinctPaths(start, end, true);
};
