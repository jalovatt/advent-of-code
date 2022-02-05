import { log } from '@lib/logging';

type Node = { value: number, prev?: Node, next?: Node };

const insertAfter = (cur: Node, value: number): Node => {
  const next = { value, prev: cur, next: cur.next };
  cur.next = next;

  return next;
};

const stepForward = (cur: Node, n: number): Node => {
  let i = 0;
  let next = cur;
  while (i < n) {
    next = next.next!;
    i += 1;
  }

  return next;
};

export const part1 = (input: string): number => {
  const steps = parseInt(input.trim(), 10);

  let count = 0;
  let size = 1;
  let head: Node = { value: 0 };
  head.next = head;
  head.prev = head;

  while (count < 2017) {
    count += 1;

    head = stepForward(head, steps % size);
    head = insertAfter(head, count);

    size += 1;
  }

  return head.next!.value;
};

/*
  Another one that takes a long time to run naively; 40 minutes, in this case.

  However, because I had it set to log whenever it inserted after zero, it quickly
  began to look like there might not be any more insertions.

  Entered the last value that had been inserted at that point, turned out I was right.
*/
export const part2 = (input: string): number => {
  const steps = parseInt(input.trim(), 10);

  let count = 0;
  let size = 1;
  const zero: Node = { value: 0 };
  let head = zero;
  head.next = head;
  head.prev = head;

  while (count < 50000000) {
    if (count % 1000000 === 0) { log(count); }
    count += 1;

    head = stepForward(head, steps % size);

    if (head === zero) {
      log(`inserting ${count} after 0`);
    }

    head = insertAfter(head, count);

    size += 1;
  }

  return zero.next!.value;
};
