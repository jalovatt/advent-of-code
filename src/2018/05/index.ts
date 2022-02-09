import { split } from '@lib/processing';

type Node = { value: number; prev: Node; next?: Node };

const length = (head: Node) => {
  let cur: Node = head;
  let count = 0;

  while (cur.next) {
    count += 1;
    cur = cur.next;
  }

  return count;
};

const remove = (node: Node, count = 1) => {
  const a = node.prev;

  let b: Node | undefined = node;
  for (let i = 0; i < count; i += 1) {
    if (b) {
      b = b.next;
    }
  }

  a.next = b;
  if (b) {
    b.prev = a;
  }
};

const filter = (head: Node, type: number) => {
  let cur: Node = head;

  const upperType = type + 32;

  while (cur.next) {
    if (cur.value === type || cur.value === upperType) {
      remove(cur);
    }
    cur = cur.next;
  }
};

const clone = (head: Node): Node => {
  const newHead = { value: head.value } as Node;

  let curSrc = head;
  let curDest = newHead;

  while (curSrc.next) {
    curDest.next = { value: curSrc.next.value, prev: curDest } as Node;

    curSrc = curSrc.next;
    curDest = curDest.next;
  }

  return newHead;
};

const willReact = (a: number, b: number) => Math.abs(a - b) === 32;

const parseInput = (input: string): [Node, Set<number>] => {
  const head: Node = { value: 10000 } as Node;
  let last = head;

  const types: Set<number> = new Set();

  split(input, '').forEach((c) => {
    const value = c.charCodeAt(0) - 65;

    if (value < 97) {
      types.add(value);
    }

    last.next = { value, prev: last } as Node;
    last = last.next;
  });

  return [head, types];
};

const collapse = (head: Node) => {
  let cur: Node = head.next!;

  while (cur.next) {
    if (willReact(cur.value, cur.next.value)) {
      remove(cur, 2);

      cur = cur.prev;
    } else {
      cur = cur.next;
    }
  }
};

export const part1 = (input: string): number => {
  const [head] = parseInput(input);
  collapse(head);

  return length(head);
};

export const part2 = (input: string): number => {
  const [head, types] = parseInput(input);

  let min = Number.MAX_SAFE_INTEGER;
  const typesArr = Array.from(types);
  for (let i = 0; i < typesArr.length; i += 1) {
    const typeHead = clone(head);

    filter(typeHead, typesArr[i]);
    collapse(typeHead);

    const l = length(typeHead);
    if (l < min) { min = l; }
  }

  return min;
};

/*
  Initially tried doing this entirely in the linked list, but filtering out each
  type with a string replace cuts a significant amount of time off. Collapsing
  with a string array takes about 100x as long.
*/
export const part2StringFiltering = (input: string): number => {
  const types: Set<string> = new Set();

  for (let i = 0; i < input.length; i += 1) {
    if (input[i].charCodeAt(0) - 65 < 32) {
      types.add(input[i]);
    }
  }

  const typesArr = Array.from(types);

  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < typesArr.length; i += 1) {
    const exp = new RegExp(`${typesArr[i]}`, 'ig');
    const filtered = input.replace(exp, '');
    const [typeHead] = parseInput(filtered);

    collapse(typeHead);

    const l = length(typeHead);

    if (l < min) { min = l; }
  }

  return min;
};
