import { split } from '@lib/processing';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

const G = 'generator';
const M = 'microchip';

type Item = { floor?: number, element: string, type: typeof G | typeof M };
interface StateNode extends INode<number, number> { value: number }

/*
  State mapping:

  ((N materials x 2 items) + 1 elevator) x 4 floors

  4 floors:
  00    0
  01    1
  10    2
  11    3

  5G 5M  4G 4M  3G 3M  2G 2M  1G 1M  E
  00 00  00 00  00 00  00 00  00 00 00
*/

const getValidCombinations = (items: Item[]): Item[][] => {
  const combinations: Item[][] = [];

  for (let i = 0; i < items.length; i += 1) {
    combinations.push([items[i]]);

    for (let j = i + 1; j < items.length; j += 1) {
      // M and different G cannot be together
      if (
        items[i].element !== items[j].element
        && items[i].type !== items[j].type
      ) {
        continue;
      }

      combinations.push([items[i], items[j]]);
    }
  }

  return combinations;
};

class StateHandler {
  initialState: number;
  targetState: number;
  elementCount: number;
  // Using 'any' because we need two-way mapping
  elementIndices: Record<any, any>;
  costs: Map<number, number>;
  toCheck: FibonacciHeap<number, number>;

  constructor(items: Item[]) {
    let state = 0;

    let ei = 0;
    this.elementIndices = {};

    for (let i = 0; i < items.length; i += 1) {
      const cur = items[i];

      if (this.elementIndices[cur.element] === undefined) {
        this.elementIndices[cur.element] = ei;
        this.elementIndices[ei] = cur.element;
        ei += 1;
      }

      let shift = this.elementIndices[cur.element] * 4 + 2;
      if (cur.type === G) { shift += 2; }

      state |= (cur.floor! << shift);
    }

    this.elementCount = ei;
    this.initialState = state;
    this.targetState = parseInt('1'.repeat(2 + (items.length * 2)), 2);
    this.costs = new Map([[state, 0]]);
    this.toCheck = new FibonacciHeap();
    this.toCheck.insert(0, state);
  }

  // If no floor given, uses the state's elevator position
  itemsOnFloor(state: number, floor = state & 0b11): Item[] {
    const items: Item[] = [];

    let cur = state;
    cur >>>= 2;

    let i = 0;

    while (i < this.elementCount) {
      const index = i >> 0;
      const f = cur & 0b11;

      if (f === floor) {
        const element = this.elementIndices[index];
        const type = i % 1 ? G : M;

        items.push({ floor, element, type });
      }

      cur >>>= 2;
      i += 0.5;
    }

    return items;
  }

  getHeuristic(state: number): number {
    let cost = 0;

    let cur = state;
    let i = 0;
    while (i < this.elementCount) {
      cost += 3 - (cur & 0b11);
      cur >>>= 2;

      i += 0.5;
    }

    return cost;
  }

  // If no item, move elevator
  updateState(state: number, items: Item[], toFloor: number): number {
    let next = state;

    for (let i = 0; i < items.length; i += 1) {
      let shift = 2 + this.elementIndices[items[i].element] * 4;
      if (items[i].type === G) { shift += 2; }

      const f = toFloor << shift;
      const offMask = this.targetState ^ (0b11 << shift);

      next = (next & offMask) | f;
    }

    next = (next & (this.targetState ^ 0b11)) | toFloor;

    return next;
  }

  // Returns new state, or null if the floor won't work
  attemptMoveItems(state: number, items: Item[], toFloor: number): number | null {
    const floorItems = this.itemsOnFloor(state, toFloor);
    for (let i = 0; i < items.length; i += 1) {
      floorItems.push(items[i]);
    }

    const counts: number[] = [];
    let hasG = false;
    let hasM = false;

    for (let i = 0; i < floorItems.length; i += 1) {
      const item = floorItems[i];
      if (item.type === M) {
        hasM = true;
      } else {
        hasG = true;
      }

      counts[this.elementIndices[item.element]] = (counts[this.elementIndices[item.element]] || 0)
        + (item.type === M ? 1 : -1);
    }

    if (hasM && hasG) {
      for (let i = 0; i < counts.length; i += 1) {
        if (counts[i] > 0) {
          return null;
        }
      }
    }

    return this.updateState(state, items, toFloor);
  }

  describe(state: number): any[] {
    const out = [];

    for (let i = 0; i < 4; i += 1) {
      out.push(this.itemsOnFloor(state, i));
    }

    out.push(`elevator: ${state & 0b11}`);

    return out;
  }

  stringify(state: number): string {
    return state.toString(2).padStart(this.targetState.toString(2).length, '0');
  }

  floorIsEmpty(state: number, floor: number): boolean {
    let cur = state;
    let i = 0;
    while (i < this.elementCount) {
      if ((cur & 0b11) === floor) { return false; }
      cur >>>= 2;
      i += 0.5;
    }

    return true;
  }

  run(): number {
    while (!this.toCheck.isEmpty()) {
      const cur = this.toCheck.extractMinimum()! as StateNode;

      const availableItems = this.itemsOnFloor(cur.value);
      const validCombinations = getValidCombinations(availableItems);

      const moves: [number, number][] = [];

      const currentFloor = cur.value & 0b11;
      for (let i = 0; i < validCombinations.length; i += 1) {
        const combo = validCombinations[i];

        for (let f = currentFloor + 1; f < 4; f += 1) {
          const next = this.attemptMoveItems(cur.value, combo, f);

          // If this one doesn't work, we can't pass it to go further
          if (!next) { break; }

          moves.push([next, f - currentFloor]);
        }

        for (let f = currentFloor - 1; f >= 0; f -= 1) {
          if (this.floorIsEmpty(cur.value, f)) { continue; }
          const next = this.attemptMoveItems(cur.value, combo, f);

          // If this one doesn't work, we can't pass it to go further
          if (!next) { break; }

          moves.push([next, currentFloor - f]);
        }
      }

      for (let i = 0; i < moves.length; i += 1) {
        const move = moves[i];

        if (!this.costs.has(move[0])) {
          const cost = this.costs.get(cur.value)! + move[1];

          if (move[0] === this.targetState) {
            return cost;
          }

          this.costs.set(move[0], cost);

          const heuristic = this.getHeuristic(move[0]);

          /*
            Magic number to weight more toward the heuristic; i.e. prioritize
            more-complete states.

            I had tried key = heuristic and noticed that it was very fast and
            only a bit off, so after fiddling with weights I was able to find a
            value that ran quickly, was valid for P1, and happened to be right
            for P2. ¯\_(ツ)_/¯

            Couldn't apply weight by increasing the heuristic; it ends up finding
            the wrong answers. Not entirely sure why this way works.
          */
          this.toCheck.insert((0.35 * cost) + heuristic, move[0]);
        }
      }
    }

    throw new Error('Never got all items to the top floor');
  }
}

enum FLOORS { first, second, third, fourth }

// eslint-disable-next-line import/prefer-default-export
export const solve = (input: string, add?: string): number => {
  const items: Item[] = [];

  const lines = split(input);

  if (add) {
    lines.push(add);
  }

  lines.forEach((line) => {
    const floor = FLOORS[line.match(/(first|second|third|fourth)/)![1] as keyof typeof FLOORS];
    const matches = [...line.matchAll(/a ([a-z]+)(?:-compatible)? (microchip|generator)/g)];

    items.push(...matches.map((m) => ({ floor, element: m[1], type: m[2] as Item['type'] })));
  });

  const handler = new StateHandler(items);
  const solution = handler.run();

  return solution;
};
