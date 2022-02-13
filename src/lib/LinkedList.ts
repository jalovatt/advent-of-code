export type LinkedListNode<T> = { value: T, prev: LinkedListNode<T>, next: LinkedListNode<T> };

/**
 * Insert a new node after the given one
 *
 * @returns The new node
 */
const insertAfter = <T>(after: LinkedListNode<T>, value: T): LinkedListNode<T> => {
  const node = { value } as LinkedListNode<T>;
  node.next = after.next;
  node.prev = after;
  after.next = node;
  node.next!.prev = node;

  return node;
};

/**
 * Remove the given node from the list, splicing the previous and next nodes together
 *
 * @returns The next node
 */
const remove = <T>(node: LinkedListNode<T>): LinkedListNode<T> => {
  node.prev.next = node.next;
  node.next.prev = node.prev;

  return node.next;
};

/**
 * @returns The node `n` steps ahead
 */
const forward = <T>(node: LinkedListNode<T>, n: number): LinkedListNode<T> => {
  let i = 0;
  let cur = node;
  while (i < n) {
    cur = cur.next!;
    i += 1;
  }

  return cur;
};

/**
 * @returns The node `n` steps back
 */
const back = <T>(node: LinkedListNode<T>, n: number): LinkedListNode<T> => {
  let i = n;
  let cur = node;
  while (i > 0) {
    cur = cur.prev!;
    i -= 1;
  }

  return cur;
};

interface StringifyOptions <T>{ join?: string, transform?: (n: LinkedListNode<T>) => any }
/**
 * Starting from `head`, join the list's values into a string
 */
const stringify = <T>(head: LinkedListNode<T>, options?: StringifyOptions<T>): string => {
  let cur = head;
  const values: any[] = [];
  do {
    values.push(options?.transform ? options.transform(cur) : cur.value);
    cur = cur.next;
  } while (cur && cur !== head);

  return values.join(options?.join ?? ' ');
};

/**
 * Create a linked list from any iterable
 */
const create = <T>(iterable: Iterable<T>, circular = false): LinkedListNode<T> => {
  const iter = iterable[Symbol.iterator]();
  let result = iter.next();

  const head: LinkedListNode<T> = { value: result.value } as LinkedListNode<T>;
  let cur = head;
  let prev: LinkedListNode<T>;

  while (!result.done) {
    result = iter.next();
    cur.next = { value: result.value, prev: cur } as LinkedListNode<T>;
    prev = cur;
    cur = cur.next;
  }

  if (circular) {
    prev!.next = head;
    head.prev = prev!;
  }

  return head;
};

export default {
  insertAfter,
  remove,
  forward,
  back,
  stringify,
  create,
};
