import { split2D } from '@lib/processing';

type Node = {
  value: number | null;
  symbol: string | null;
  neighbours: Set<Node>;
};

const parseInput = (input: string): Node[] => {
  const nodes: Node[] = [];

  split2D(input).forEach((row, y) => row.forEach((cell, x) => {
    const code = (cell as string).charCodeAt(0);
    const isNumber = code >= 48 && code <= 57;

    let n: Node = {
      value: (isNumber && parseInt(cell, 10)) || null,
      symbol: (!isNumber && cell !== '.' && cell) || null,
      neighbours: new Set(),
    };

    if (x > 0) {
      const prev = nodes[nodes.length - 1];

      // There are no leading 0s in the input, so this is safe
      if (isNumber && prev?.value) {
        n = prev;
        n.value = 10 * prev.value + parseInt(cell, 10);
      } else {
        n.neighbours.add(prev);
        prev.neighbours.add(n);
      }
    }

    nodes.push(n);

    if (y > 0) {
      const upIndex = nodes.length - row.length - 1;

      if (x > 0) {
        const ul = nodes[upIndex - 1];
        n.neighbours.add(ul);
        ul.neighbours.add(n);
      }

      const up = nodes[upIndex];
      n.neighbours.add(up);
      up.neighbours.add(n);

      if (x < row.length - 1) {
        const ur = nodes[upIndex + 1];
        n.neighbours.add(ur);
        ur.neighbours.add(n);
      }
    }
  }));

  return nodes;
};

export const part1 = (input: string): number => {
  const nodes = parseInput(input);

  const visited: Set<Node> = new Set();
  const partNumbers: number[] = [];

  nodes.forEach((node) => {
    if (!node.value || visited.has(node)) { return; }
    visited.add(node);

    for (const neighbour of node.neighbours.values()) {
      if (neighbour.symbol) {
        partNumbers.push(node.value);
        break;
      }
    }
  });

  return partNumbers.reduce((acc, cur) => acc + cur);
};

export const part2 = (input: string): number => {
  const nodes = parseInput(input);

  let gearRatioSum = 0;

  nodes.forEach((node) => {
    if (node.symbol !== '*') { return; }

    const numberNodes = [];
    for (const neighbour of node.neighbours.values()) {
      if (neighbour.value) {
        numberNodes.push(neighbour.value);
      }
    }

    if (numberNodes.length === 2) {
      gearRatioSum += numberNodes[0] * numberNodes[1];
    }
  });

  return gearRatioSum;
};
