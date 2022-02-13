import LinkedList from './LinkedList';
import type { LinkedListNode } from './LinkedList';

const getTestList = (): Record<string, LinkedListNode<number>> => {
  const list = {
    a: { value: 1 } as LinkedListNode<number>,
    b: { value: 2 } as LinkedListNode<number>,
    c: { value: 3 } as LinkedListNode<number>,
  };

  list.a.next = list.b;
  list.b.next = list.c;
  list.b.prev = list.a;
  list.c.prev = list.b;

  return list;
};

describe('LinkedList', () => {
  test('insertAfter', () => {
    const list = getTestList();

    const d = LinkedList.insertAfter(list.a, 4);

    expect(list.a.next).toEqual(d);
    expect(list.b.prev).toEqual(d);
    expect(d.value).toEqual(4);
  });

  test('remove', () => {
    const list = getTestList();

    const result = LinkedList.remove(list.a.next);
    expect(result).toEqual(list.c);
    expect(list.a.next).toEqual(list.c);
    expect(list.c.prev).toEqual(list.a);
  });

  test('forward', () => {
    const list = getTestList();
    const got = LinkedList.forward(list.a, 2);

    expect(got).toEqual(list.c);
  });

  test('back', () => {
    const list = getTestList();
    const got = LinkedList.back(list.c, 2);

    expect(got).toEqual(list.a);
  });

  test('stringify', () => {
    const list = getTestList();
    const str = LinkedList.stringify(list.a);

    expect(str).toEqual('1 2 3');
  });

  test('stringify (transform)', () => {
    const list = getTestList();
    const str = LinkedList.stringify(list.a, { transform: (n: LinkedListNode<number>) => `[${n.value}]` });

    expect(str).toEqual('[1] [2] [3]');
  });

  test('create', () => {
    const arr = [1, 3, 2, 4];
    const head = LinkedList.create(arr);

    expect(head.value).toEqual(1);
    expect(head.next.value).toEqual(3);
    expect(head.next.next.value).toEqual(2);
    expect(head.next.next.next.value).toEqual(4);
  });

  test('create (circular)', () => {
    const arr = [1, 3, 2, 4];
    const head = LinkedList.create(arr, true);

    expect(head.value).toEqual(1);
    expect(head.next.value).toEqual(3);
    expect(head.next.next.value).toEqual(2);
    expect(head.next.next.next.value).toEqual(4);
    expect(head.next.next.next.next.value).toEqual(1);
    expect(head.prev.value).toEqual(4);
  });
});
