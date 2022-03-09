import { log } from '@lib/logging';

enum Dir { N = 'N', S = 'S', E = 'E', W = 'W', X = 'X' }
type Node = { value: Dir[], children: Node[], circular: boolean };
enum Group { Start = '(', Close = ')', Delim = '|' }

type Field = Map<number, number>;

type Mover = { pos: number, node: Node, travelled: number };

/*
  Input has ~2800 each of N, E, W, S, so we can safely use 12 bits (4096) per axis

  Y            X
  111111111111 111111111111

  Because we can move in four directions, our origin should be half of each axis'
  range to avoid hitting negative values.

  100000000000 100000000000
  2048         2048
*/

const ORIGIN = 0b100000000000100000000000;

const incrementPos = {
  x: (p: number, v: number) => p + v,
  y: (p: number, v: number) => p + (v * 4096),
};

const move: Record<Dir, (p: number) => number> = {
  [Dir.N]: (p) => incrementPos.y(p, -1),
  [Dir.S]: (p) => incrementPos.y(p, 1),
  [Dir.E]: (p) => incrementPos.x(p, 1),
  [Dir.W]: (p) => incrementPos.x(p, -1),
  [Dir.X]: (p) => p,
};

class Scanner {
  str: string;
  cursor: number;

  constructor(str: string) {
    this.str = str;
    this.cursor = 0;
  }

  peek(): string | null {
    return this.str[this.cursor] || null;
  }

  pop(): string | null {
    // eslint-disable-next-line no-plusplus
    return this.str[this.cursor++] || null;
  }
}

const checkCircular = (arr: Dir[]): boolean => {
  const counts: Record<Dir, number> = { N: 0, S: 0, E: 0, W: 0, X: 0 };

  for (let i = 0; i < arr.length; i += 1) {
    counts[arr[i]] += 1;
  }

  return counts.N === counts.S && counts.E === counts.W;
};

const parse = (scanner: Scanner): Node => {
  const n: Node = { value: [], children: [], circular: false };

  while (scanner.peek()! in Dir) {
    n.value.push(scanner.pop() as Dir);
  }

  if (n.value[0] === Dir.X) {
    return n;
  }

  if (n.value.length && checkCircular(n.value)) {
    n.circular = true;
  }

  if (scanner.peek() === Group.Delim) {
    return n;
  }

  if (scanner.peek() === Group.Start) {
    while (scanner.peek() === Group.Start || scanner.peek() === Group.Delim) {
      scanner.pop();
      const child = parse(scanner);

      n.children.push(child);
    }
  }

  if (scanner.peek() === Group.Close && !n.children.length) {
    return n;
  }

  if (scanner.peek()) {
    scanner.pop();
    const peek = scanner.peek();
    if (peek) {
      const rest = parse(scanner);

      for (let i = 0; i < n.children.length; i += 1) {
        n.children[i].children.push(rest);
      }
    }
  }

  return n;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (head: Node) => {
  const seen: Set<Node> = new Set();

  const out: string[] = [];
  const toCheck: Node[] = [head];
  seen.add(head);

  while (toCheck.length) {
    const cur = toCheck.shift()!;

    out.push(`${cur.value}, ${cur.children.length} children\n${cur.children.map((c) => `  ${c.value}`).join('\n')}`);

    cur.children.forEach((c) => {
      if (!seen.has(c)) {
        seen.add(c);
        toCheck.push(c);
      }
    });
  }

  log(out.join('\n\n'));
};

const run = (input: string): Field => {
  const str = input.trim().slice(1, -1)
    /*
      Adding a noop command because I can't figure out how to handle |) in the
      parser.
    */
    .replace(/\|\)/g, '|X)');
  const head = parse(new Scanner(str))!;

  const field: Field = new Map();
  field.set(ORIGIN, 0);

  const movers: Mover[] = [{ pos: ORIGIN, node: head, travelled: 0 }];
  while (movers.length) {
    const cur = movers.pop()!;

    const moves = cur.node.value;
    for (let i = 0; i < moves.length; i += 1) {
      const m = moves[i];

      if (m === Dir.X) {
        continue;
      }

      cur.pos = move[m](cur.pos);
      cur.travelled += 1;

      const has = field.get(cur.pos);

      if (has === undefined || cur.travelled < has) {
        field.set(cur.pos, cur.travelled);
      }
    }

    /*
      The direct path will always be shorter, so continuing on from circular nodes
      will never change the state of the field. Worse, it would double the size
      of the search space each time. This solution takes ~20ms, but without
      the check it's somewhere upwards of an hour.
    */
    if (cur.node.circular) {
      continue;
    }

    const children = cur.node.children;
    for (let i = 0; i < children.length; i += 1) {
      movers.push({ pos: cur.pos, travelled: cur.travelled, node: children[i] });
    }
  }

  return field;
};

export const part1 = (input: string): number => {
  const field = run(input);
  const paths = Array.from(field.values())
    .sort((a, b) => b - a);

  return paths[0];
};

export const part2 = (input: string): number => {
  const field = run(input);

  return Array.from(field.values()).filter((v) => v >= 1000).length;
};
