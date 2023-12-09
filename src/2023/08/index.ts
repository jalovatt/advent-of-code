import { lcm } from '@lib/math';
import { split } from '@lib/processing';

type Node = {
  label: string;
  isStart: boolean;
  isEnd: boolean;
  left: Node;
  right: Node;
};

const parseInput = (input: string): { steps: string, nodes: Map<string, Node> } => {
  const [steps, map] = split(input, '\n\n');

  const nodes: Map<string, Node> = new Map();

  for (const line of map.split('\n')) {
    const match = line.match(/(\w{3})/g)!;
    const [label, left, right] = match;

    if (!nodes.has(left)) {
      nodes.set(left, {} as Node);
    }

    if (!nodes.has(right)) {
      nodes.set(right, {} as Node);
    }

    if (!nodes.has(label)) {
      nodes.set(label, {} as Node);
    }

    const node = nodes.get(label)!;
    node.label = label;
    node.isStart = label.endsWith('A');
    node.isEnd = label.endsWith('Z');
    node.left = nodes.get(left)!;
    node.right = nodes.get(right)!;
  }

  return { steps, nodes };
};

export const part1 = (input: string): number => {
  const { steps, nodes } = parseInput(input);

  let at = nodes.get('AAA')!;
  let stepsTaken = 0;

  while (!at.isEnd) {
    const dir = steps[stepsTaken % steps.length] === 'L' ? 'left' : 'right';

    at = at[dir];
    stepsTaken += 1;
  }

  return stepsTaken;
};

export const part2 = (input: string): number => {
  const { steps, nodes } = parseInput(input);

  let stepsTaken = 0;
  const walkers: Node[] = Array.from(nodes.values())
    .filter((n) => n.isStart);

  const periods: number[] = [];

  while (walkers.length) {
    const dir = steps[stepsTaken % steps.length] === 'L' ? 'left' : 'right';
    stepsTaken += 1;

    for (let i = 0; i < walkers.length; i += 1) {
      walkers[i] = walkers[i][dir];

      if (walkers[i].isEnd) {
        periods.push(stepsTaken);
        walkers.splice(i, 1);
        i -= 1;
      }
    }
  }

  return lcm(...periods.values());
};
