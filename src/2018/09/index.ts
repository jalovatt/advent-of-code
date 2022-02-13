import LinkedList, { LinkedListNode } from '@lib/LinkedList';

const solve = (players: number, max: number): number => {
  const scores: number[] = new Array(players).fill(0);

  const head = { value: 0 } as LinkedListNode<number>;
  let cur: LinkedListNode<number> = head;

  cur.next = cur;
  cur.prev = cur;

  let p = 1;
  let m = 1;

  while (m <= max) {
    if (m % 23 === 0) {
      const ccw7 = cur.prev.prev.prev.prev.prev.prev.prev;
      scores[p] += m + ccw7.value;
      cur = LinkedList.remove(ccw7);
    } else {
      cur = LinkedList.insertAfter(cur.next, m);
    }

    p += 1;
    if (p === scores.length) {
      p = 0;
    }

    m += 1;
  }

  return Math.max(...scores);
};

export const part1 = (input: string): number => {
  const [players, max] = input.match(/\d+/g)!.map((n) => parseInt(n, 10));

  return solve(players, max);
};

export const part2 = (input: string): number => {
  const [players, max] = input.match(/\d+/g)!.map((n) => parseInt(n, 10));

  return solve(players, max * 100);
};
