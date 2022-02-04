import { split } from '@lib/processing';

type Step = { move: 's', a: number, b: undefined } | { move: 'p', a: string, b: string } | { move: 'x', a: number, b: number };
type Node = { value: string, prev?: Node, next?: Node };

const parseInput = (input: string): Step[] => split(input, ',').map((step) => {
  const [, move, aRaw, bRaw] = step.match(/(.)([^/]+)\/?(.+)?/)!;

  const a = parseInt(aRaw, 10);
  const b = parseInt(bRaw, 10);

  return {
    move,
    a: !Number.isNaN(a) ? a : aRaw,
    b: !Number.isNaN(b) ? b : bRaw,
  } as Step;
});

let w: Node | undefined;
let x: Node | undefined;
let y: Node | undefined;
let z: Node | undefined;

const mutSwap = (a: Node, b: Node) => {
  if (a.next === b) {
    w = a.prev!;
    z = b.next!;

    w.next = b;
    b.prev = w;

    b.next = a;
    a.prev = b;

    a.next = z;
    z.prev = a;
  } else if (b.next === a) {
    w = b.prev!;
    z = a.next!;

    w.next = a;
    a.prev = w;

    a.next = b;
    b.prev = a;

    b.next = z;
    z.prev = b;
  } else {
    w = a.prev!;
    x = a.next!;
    y = b.prev!;
    z = b.next!;

    w.next = b;
    b.prev = w;

    b.next = x;
    x.prev = b;

    y.next = a;
    a.prev = y;

    a.next = z;
    z.prev = a;
  }
};

const move = (head: Node, n: number): Node => {
  let times = n;
  const inc = (n > 0) ? -1 : 1;
  let cur = head;

  while (times) {
    cur = (n > 0) ? cur.next! : cur.prev!;
    times += inc;
  }

  return cur;
};

const stringify = (head: Node) => {
  let cur = head;
  const out: string[] = [];

  do {
    out.push(cur.value);
    cur = cur.next!;
  } while (cur !== head);

  return out.join('');
};

const run = (input: string, n: number, times: number): string => {
  const nodes: Node[] = new Array(n).fill(null).map((_, i) => ({
    value: String.fromCharCode(i + 97),
  }));

  for (let i = 0; i < nodes.length; i += 1) {
    nodes[i].prev = nodes[(i - 1 + nodes.length) % nodes.length];
    nodes[i].next = nodes[(i + 1) % nodes.length];
  }

  const byValue: Record<string, Node> = nodes.reduce((acc, cur) => {
    acc[cur.value] = cur;

    return acc;
  }, {} as Record<string, Node>);

  const steps = parseInput(input);

  let head = nodes[0];

  const seen: Map<string, number> = new Map();

  let t = 0;
  while (t < times) {
    for (let i = 0; i < steps.length; i += 1) {
      const s = steps[i];

      if (s.move === 'p') {
        const a = byValue[s.a];
        const b = byValue[s.b];

        mutSwap(a, b);

        if (head === a) {
          head = b;
        } else if (head === b) {
          head = a;
        }
      } else if (s.move === 'x') {
        const a = move(head, s.a);
        const b = move(head, s.b);

        mutSwap(a, b);

        if (head === a) {
          head = b;
        } else if (head === b) {
          head = a;
        }
      } else {
        head = move(head, -s.a);
      }
    }

    const k = stringify(head);

    /*
      This problem would take the better part of a year to run naively, but it
      turns out that the sequence loops back to abcde... really, really quickly.
    */
    if (seen.has(k)) {
      const target = (times % t) - 1;

      return Array.from(seen.entries()).find(([, value]) => value === target)![0];
    }

    seen.set(k, t);

    t += 1;
  }

  return stringify(head);
};

export const part1 = (input: string, n = 16): string => run(input, n, 1);
export const part2 = (input: string): string => run(input, 16, 1000000000);
