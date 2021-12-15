/* eslint-disable guard-for-in */
import { split } from '../../utilities/processing';
import runTimes from '../../utilities/runTimes';

type NestedRecord<T> = Record<string, Record<string, T>>;
type Rules = NestedRecord<string>;
type PairCounts = NestedRecord<number>;

class LinkedListNode {
  value: string;
  next?: LinkedListNode;

  constructor(value: string) {
    this.value = value;
  }
}

const createLinkedList = (base: string): LinkedListNode => {
  const first = new LinkedListNode(base[0]);

  let cur = first;

  for (let i = 1; i < base.length; i += 1) {
    cur.next = new LinkedListNode(base[i]);

    cur = cur.next;
  }

  return first;
};

const countLettersA = (firstNode: LinkedListNode): Record<string, number> => {
  const counts: Record<string, number> = {};

  let cur: LinkedListNode | undefined = firstNode;
  while (cur) {
    counts[cur.value] = (counts[cur.value] || 0) + 1;

    cur = cur.next;
  }

  return counts;
};

const getMinMaxQuantities = (counts: Record<string, number>): [number, number] => (
  Object.values(counts).reduce((acc, cur) => {
    acc[0] = Math.min(acc[0], cur);
    acc[1] = Math.max(acc[1], cur);

    return acc;
  }, [Number.MAX_SAFE_INTEGER, 0])
);

const stepA = (firstNode: LinkedListNode, rules: Rules) => {
  let cur = firstNode;
  while (cur.next) {
    const insert = rules[cur.value]?.[cur.next?.value];

    if (insert) {
      const insertNode = new LinkedListNode(insert);

      insertNode.next = cur.next;
      cur.next = insertNode;

      cur = insertNode.next;
    } else {
      cur = cur.next;
    }
  }
};

const stepB = (pairs: PairCounts, rules: Rules) => {
  const next: PairCounts = {};

  // eslint-disable-next-line guard-for-in
  for (const left in pairs) {
    for (const right in pairs[left]) {
      const insert = rules[left]?.[right];

      if (insert) {
        const n = pairs[left][right];

        if (!next[left]) { next[left] = {}; }
        next[left][insert] = (next[left][insert] || 0) + n;

        if (!next[insert]) { next[insert] = {}; }
        next[insert][right] = (next[insert][right] || 0) + n;
      }
    }
  }

  return next;
};

const countLettersB = (pairs: PairCounts) => {
  const counts: Record<string, number> = {};

  Object.values(pairs).forEach((pointedAt) => {
    for (const k in pointedAt) {
      counts[k] = (counts[k] || 0) + pointedAt[k];
    }
  });

  return counts;
};

export const a = (input: string) => {
  const [base, rawRules] = split(input, '\n\n');
  const firstNode = createLinkedList(base);
  const rules: Rules = rawRules.split('\n').reduce((acc, cur) => {
    const [, first, second, insert] = cur.match(/(\w)(\w) -> (\w)/)!;
    if (!acc[first]) { acc[first] = {}; }
    acc[first][second] = insert;

    return acc;
  }, {} as Rules);

  runTimes(10, () => stepA(firstNode, rules));

  const counts = countLettersA(firstNode);
  const [min, max] = getMinMaxQuantities(counts);

  return max - min;
};

/*
  This one was a struggle.

  Tried:
    1. Naive array + strings, worked fine for part A but blew up on B around step 15.
    2. Refactored to a linked list, which did better but still stalled at step 23.

  After reading a few explanations, I was able to get something that makes sense:
  - For each step
    - For each pair with a matching rule
      - Add the pair's current count to the counts for the new left and right pairs
  - Aggregate the counts for each letter being pointed AT
  - Add 1 for the very first letter in the base string, since it hasn't changed
    and nothing points at it
*/
export const b = (input: string) => {
  const [base, rawRules] = split(input, '\n\n');
  const pairs: Record<string, Record<string, number>> = {};

  for (let i = 0; i < base.length - 1; i += 1) {
    if (!pairs[base[i]]) { pairs[base[i]] = {}; }
    pairs[base[i]][base[i + 1]] = (pairs[base[i]][base[i + 1]] || 0) + 1;
  }

  const rules: Rules = rawRules.split('\n').reduce((acc, cur) => {
    const [, first, second, insert] = cur.match(/(\w)(\w) -> (\w)/)!;
    if (!acc[first]) { acc[first] = {}; }
    acc[first][second] = insert;

    return acc;
  }, {} as Record<string, Record<string, string>>);

  let currentPairs = pairs;
  runTimes(40, () => {
    currentPairs = stepB(currentPairs, rules);
  });

  const counts = countLettersB(currentPairs);
  // We only counted things being pointed AT
  counts[base[0]] += 1;

  const [min, max] = getMinMaxQuantities(counts);

  return max - min;
};
