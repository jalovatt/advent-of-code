import { lcm } from '@lib/math';
import { split } from '@lib/processing';

type BaseModule = {
  id: string;
  destIds: string[];
};

interface FlipFlop extends BaseModule {
  state: boolean;
}

interface Conjunction extends BaseModule {
  inputStates: Set<string>;
  nInputs: number;
}

interface Broadcast extends BaseModule {}

type Module = Broadcast | Conjunction | FlipFlop;

type Pulse = {
  srcId: string;
  destId: string;
  value: boolean;
};

type Node<T> = {
  value: T;
  next?: Node<T>;
};

class Queue<T> {
  start?: Node<T>;
  end?: Node<T>;

  push(value: T) {
    const n: Node<T> = { value };
    if (this.end) {
      this.end.next = n;
      this.end = n;
    } else {
      this.start = n;
      this.end = n;
    }
  }

  shift(): T | undefined {
    if (this.start) {
      const n = this.start;
      this.start = this.start.next;

      if (!this.start) {
        this.end = undefined;
      }

      return n.value;
    }

    return undefined;
  }
}

const parseInput = (input: string): Map<string, Module> => {
  const modules: Map<string, Module> = new Map();
  const sourceCounts: Map<string, number> = new Map();
  split(input).forEach((line) => {
    const match = line.match(/^([%&])?(\w+) -> (.+)$/);
    if (!match) { throw new Error(`Couldn't match: ${match}`); }

    const [, type, id, destStr] = match;
    const destIds = destStr.split(', ');

    let m: Module;
    if (type === '%') {
      m = { id, destIds, state: false } as FlipFlop;
    } else if (type === '&') {
      m = { id, destIds, inputStates: new Set(), nInputs: 0 } as Conjunction;
    } else {
      m = { id, destIds } as Broadcast;
    }

    modules.set(id, m);

    for (const destId of destIds) {
      const count = sourceCounts.get(destId);
      if (!count) {
        sourceCounts.set(destId, 1);
      } else {
        sourceCounts.set(destId, count + 1);
      }
    }
  });

  for (const m of modules.values()) {
    if ('nInputs' in m) {
      m.nInputs = sourceCounts.get(m.id)!;
    }
  }

  return modules;
};

const solve = (input: string, part2 = false): number => {
  const modules = parseInput(input);
  const pulses = new Queue<Pulse>();

  const count = {
    high: 0,
    low: 0,
  };

  let presses = 0;

  /*
    For part 2, we can break it down into finding four separate cycle lengths
    for the branches of the graph and then determining when all of them will
    line up.

    Thanks Reddit.
  */
  let loopNodeIds: Set<string>;
  const loopSizes: number[] = [];

  if (part2) {
    const modulesArr = [...modules.values()];
    const target = modulesArr.find((m) => m.destIds.includes('rx'))!.id;
    loopNodeIds = new Set(modulesArr.filter((m) => m.destIds.includes(target)).map((m) => m.id));
  }

  const send = (srcId: string, value: boolean, destIds: string[]): number | null => {
    for (const destId of destIds) {
      if (part2 && loopNodeIds.has(destId) && !value) {
        loopSizes.push(presses);
      }

      count[value ? 'high' : 'low'] += 1;

      if (destId !== 'output') {
        pulses.push({ srcId, destId, value });
      }
    }

    return null;
  };

  while (presses < (part2 ? 10000 : 1000)) {
    presses += 1;
    send('button', false, ['broadcaster']);

    do {
      const { srcId, destId, value } = pulses.shift()!;

      const m = modules.get(destId)!;
      if (!m) { continue; }

      // Switch based on the module type
      if ('state' in m) {
        // FlipFlops ignore high pulses
        if (!value) {
          m.state = !m.state;
          send(m.id, m.state, m.destIds);
        }
      } else if ('nInputs' in m) {
        m.inputStates[value ? 'add' : 'delete'](srcId);

        // Send a low pulse if all inputs are currently high, otherwise send
        // a high pulse
        if (m.inputStates.size === m.nInputs) {
          send(m.id, false, m.destIds);
        } else {
          send(m.id, true, m.destIds);
        }
      } else {
        send(m.id, value, m.destIds);
      }
    } while (pulses.start);

    if (part2 && loopSizes.length === 4) {
      break;
    }
  }

  return part2
    // The sizes are all prime, so the lcm is just their product
    ? loopSizes.reduce((acc, cur) => acc * cur, 1)
    : count.low * count.high;
};

export const part1 = (input: string): number => solve(input);
export const part2 = (input: string): number => solve(input, true);
