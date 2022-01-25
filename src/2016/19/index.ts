type Node = { id: number, next: Node };

export const part1 = (input: string): number => {
  const n = parseInt(input, 10);

  const first = { id: 1 } as Node;
  let prev = first;
  for (let i = 1; i < n; i += 1) {
    const elf = { id: i + 1 } as Node;
    prev.next = elf;
    prev = elf;
  }

  prev.next = first;

  let cur = first;

  while (cur.next !== cur) {
    cur.next = cur.next.next;
    cur = cur.next;
  }

  return cur.id;
};

export const part2 = (input: string): number => {
  let n = parseInt(input, 10);

  const first = { id: 1 } as Node;
  let prev = first;

  for (let i = 1; i < n; i += 1) {
    const elf = { id: i + 1 } as Node;
    prev.next = elf;
    prev = elf;
  }

  prev.next = first;

  let cur = first;

  /*
    As we go, keep track of the elf before the last elf we removed; the next
    one will always be 1 or 2 after them.
  */
  let target = cur;
  let nTarget = ((n - 1) >>> 1);

  while (nTarget) {
    if (nTarget === 1) { prev = target; }
    target = target.next;
    nTarget -= 1;
  }

  while (cur.next !== cur) {
    target = (n & 1) ? prev.next : prev.next.next;
    prev = (n & 1) ? prev : prev.next;

    n -= 1;

    prev.next = target.next;
    cur = cur.next;
  }

  return cur.id;
};
