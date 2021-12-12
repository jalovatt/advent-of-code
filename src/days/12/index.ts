/* eslint-disable max-classes-per-file */
import { split } from '../../utilities/processing';

class Node {
  value: string;
  isLarge: boolean;
  edges: Set<Node>;

  constructor(value: string) {
    this.value = value;
    this.isLarge = (value.toUpperCase() === value);
    this.edges = new Set();
  }

  connect(node: Node) {
    this.edges.add(node);
    node.edges.add(this);
  }
}

class Visitor {
  current: Node;
  visitedCount: Map<Node, number>;
  visited: string;
  hasExtraVisit: boolean;

  constructor(current: Node, visitedCount: Map<Node, number>, visited = '', hasExtraVisit = false) {
    this.current = current;
    this.visitedCount = new Map(Array.from(visitedCount));
    this.visitedCount.set(current, (this.visitedCount.get(current) || 0) + 1);
    this.visited = `${visited},${current.value}`;
    this.hasExtraVisit = hasExtraVisit;
  }

  move(): [[Node, boolean][], Map<Node, number>, string] {
    const out: [Node, boolean][] = [];

    this.current.edges.forEach((edge) => {
      const visitedTimes = this.visitedCount.get(edge);

      if (edge.isLarge || !visitedTimes) {
        out.push([edge, this.hasExtraVisit])
      } else if (visitedTimes === 1 && this.hasExtraVisit) {
        out.push([edge, false]);
      }
    });

    return [out, this.visitedCount, this.visited];
  }
}

const getObjWithDefaultNode = (): { [key: string]: Node } => (
  new Proxy({} as { [key: string]: Node }, {
    get: (t, p) => { if (!t[p]) { t[p] = new Node(p); } return t[p]; },
  })
);

export const a = (input: string) => {
  const entries = split(input).map((line) => line.split('-'));

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

  const visitors = [new Visitor(start!, new Map())];

  let paths = 0;

  // Circuit breaker
  let times = 20000;

  while (visitors.length && times > 0) {
    const cur = visitors.pop()!;

    const [next, visitedCount] = cur.move();

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    next.forEach(([node]) => {
      if (node === end) {
        paths += 1;
      } else {
        visitors.push(new Visitor(node, visitedCount));
      }
    });

    times -= 1;
  }

  if (!times) {
    throw new Error(`Hit circuit breaker, paths = ${paths}, visitors left = ${visitors.length}`);
  }

  return paths;
};

export const b = (input: string) => {
  const entries = split(input).map((line) => line.split('-'));

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

  const visitors = [new Visitor(start!, new Map(), '', true)];

  const paths: string[] = [];

  // Circuit breaker
  let times = 500000;

  while (visitors.length && times > 0) {
    const cur = visitors.pop()!;

    const [next, visitedCount, visited] = cur.move();

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    next.forEach(([node, hasExtraVisit]) => {
      if (node === end) {
        paths.push(visited);
      } else if (node !== start) {
        visitors.push(new Visitor(node, visitedCount, visited, hasExtraVisit));
      }
    });

    times -= 1;
  }

  if (!times) {
    throw new Error(`Hit circuit breaker, paths = ${paths.length}, visitors left = ${visitors.length}`);
  }

  // console.dir(paths);

  return paths.length;
};
