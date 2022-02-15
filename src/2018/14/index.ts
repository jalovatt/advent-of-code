import CircuitBreaker from '@lib/CircuitBreaker';
import LinkedList from '@lib/LinkedList';
import { splitToNumber } from '@lib/processing';

export const part1 = (input: string): string => {
  const N = parseInt(input, 10);

  const head = LinkedList.create([3, 7], true);
  let tail = head.prev;
  let length = 2;

  let a = head;
  let b = head.next;

  const step = () => {
    const sum = a.value + b.value;

    if (sum > 9) {
      tail = LinkedList.insertAfter(tail, (sum / 10) >> 0);
      length += 1;
    }
    tail = LinkedList.insertAfter(tail, sum % 10);
    length += 1;

    a = LinkedList.forward(a, a.value + 1);
    b = LinkedList.forward(b, b.value + 1);
  };

  while (length <= N) {
    step();
  }

  const recipesStart = tail;
  while (length < N + 10) {
    step();
  }

  const recipes: number[] = [];

  let cur = recipesStart;
  while (cur !== head) {
    recipes.push(cur.value);
    cur = cur.next;
  }

  // More than 10 recipes might have been added
  return recipes.slice(0, 10).join('');
};

export const part2 = (input: string): number => {
  const wantDigits = splitToNumber(input, '');

  const head = LinkedList.create([3, 7], true);
  let tail = head.prev;

  let a = head;
  let b = head.next;

  const checkDigits = () => {
    let cur = tail;

    for (let i = wantDigits.length - 1; i >= 0; i -= 1) {
      if (wantDigits[i] !== cur.value) { return false; }
      cur = cur.prev;
    }

    return true;
  };

  const step = () => {
    const sum = a.value + b.value;

    if (sum > 9) {
      tail = LinkedList.insertAfter(tail, 1);

      if (checkDigits()) { return true; }
    }
    tail = LinkedList.insertAfter(tail, sum % 10);
    if (checkDigits()) { return true; }

    a = LinkedList.forward(a, a.value + 1);
    b = LinkedList.forward(b, b.value + 1);

    return false;
  };

  const breaker = new CircuitBreaker(100000000);
  while (!breaker.hasTripped) {
    breaker.tick();

    if (step()) {
      let count = 1;
      let cur = tail;
      cur = LinkedList.back(cur, wantDigits.length);
      while (cur !== head) {
        count += 1;
        cur = cur.prev;
      }

      return count;
    }
  }

  throw new Error('Sequence never appeared');
};
