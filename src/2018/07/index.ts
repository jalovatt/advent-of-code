import { split } from '@lib/processing';

type Node = { value: string, blockedBy: Node[], blocks: Node[] };
type Nodes = Record<string, Node>;

const parseInput = (input: string): [Node[], Nodes] => {
  const nodes: Nodes = {};

  split(input).forEach((line) => {
    const [a, b] = line.match(/\b[A-Z]\b/g)!;

    if (!nodes[b]) { nodes[b] = { value: b, blockedBy: [], blocks: [] }; }
    if (!nodes[a]) { nodes[a] = { value: a, blockedBy: [], blocks: [] }; }

    nodes[a].blocks.push(nodes[b]);
    nodes[b].blockedBy.push(nodes[a]);
  });

  const unblocked = Object.values(nodes).filter((n) => !n.blockedBy.length);

  return [unblocked, nodes];
};

export const part1 = (input: string): string => {
  const [unblocked] = parseInput(input);

  const done: Set<Node> = new Set();
  const order: string[] = [];

  while (unblocked.length) {
    unblocked.sort((a, b) => b.value.localeCompare(a.value));

    const cur = unblocked.pop()!;
    order.push(cur.value);

    done.add(cur);

    for (let i = 0; i < cur.blocks.length; i += 1) {
      const b = cur.blocks[i];

      let isUnblocked = true;
      for (let j = 0; j < b.blockedBy.length; j += 1) {
        if (!done.has(b.blockedBy[j])) {
          isUnblocked = false;
          break;
        }
      }

      if (isUnblocked) {
        unblocked.push(b);
      }
    }
  }

  return order.join('');
};

export const part2 = (input: string, numWorkers = 5, baseTime = 60): number => {
  const [unblocked, nodes] = parseInput(input);

  const finishedAt: Map<Node, number> = new Map();

  const timeToFinishNode = (n: Node) => n.value.charCodeAt(0) - 64 + baseTime;

  const workers: ([Node, number] | null)[] = new Array(numWorkers).fill(null);

  let t = 0;
  const l = Object.keys(nodes).length;

  while (finishedAt.size < l) {
    const willUnblock: Node[] = [];

    unblocked.sort((a, b) => b.value.localeCompare(a.value));
    for (let i = 0; i < workers.length; i += 1) {
      // Workers that can take a new job
      if (workers[i] === null && unblocked.length) {
        const n = unblocked.pop()!;
        workers[i] = [n, timeToFinishNode(n)];
      }

      if (workers[i] === null) { continue; }

      workers[i]![1] -= 1;

      // Workers that are now finished
      if (workers[i]![1] === 0) {
        const n = workers[i]![0];
        finishedAt.set(workers[i]![0], t);
        workers[i] = null;

        for (let j = 0; j < n.blocks.length; j += 1) {
          const b = n.blocks[j];

          let isUnblocked = true;
          for (let k = 0; k < b.blockedBy.length; k += 1) {
            if (!finishedAt.has(b.blockedBy[k])) {
              isUnblocked = false;
              break;
            }
          }

          // Using an intermediate queue because new jobs can't be started on
          // the same step their blocker was finished
          if (isUnblocked) {
            willUnblock.push(b);
          }
        }
      }
    }

    unblocked.push(...willUnblock);

    t += 1;
  }

  return Array.from(finishedAt.values()).sort((a, b) => b - a)[0] + 1;
};
