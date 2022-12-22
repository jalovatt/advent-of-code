import { split } from '@lib/processing';

type Operator = '+' | '-' | '*' | '/';
type Operation = (a: number, b: number) => number;
type ReverseOperation = (n: number, a: string | number, b: string | number) => number;
type Monkey = { name: string, a: string, b: string, op: Operator };

const resolve: Record<Operator, Operation> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
};

const reverseOperation: Record<Operator, ReverseOperation> = {
  '+': (n, a, b) => (
    typeof a === 'number'
      ? n - a as number
      : n - (b as number)
  ),
  '-': (n, a, b) => (
    typeof a === 'number'
      ? a - n
      : n + (b as number)
  ),
  '*': (n, a, b) => (
    typeof a === 'number'
      ? n / a
      : n / (b as number)
  ),
  '/': (n, a, b) => (
    // Verified by hand that all simplified divisions are "str / number"
    n * (b as number)
  ),
};

export const part1 = (input: string): number => {
  const resolved: Map<string, number> = new Map();
  const toResolve: Monkey[] = [];

  split(input).forEach((line) => {
    const [name, content] = line.split(': ');

    const n = parseInt(content, 10);
    if (n) {
      resolved.set(name, n);
    } else {
      const [a, op, b] = content.split(' ');
      toResolve.push({ name, a, b, op: op as Operator });
    }
  });

  // Check each monkey to see if it can be resolved until we've resolved all of them
  let i = 0;
  while (toResolve.length) {
    const cur = toResolve[i];

    if (resolved.has(cur.a) && resolved.has(cur.b)) {
      resolved.set(cur.name, resolve[cur.op](resolved.get(cur.a)!, resolved.get(cur.b)!));

      toResolve.splice(i, 1);
    } else {
      i += 1;
    }

    i %= toResolve.length;
  }

  return resolved.get('root')!;
};

export const part2 = (input: string): number => {
  const monkeys: Map<string, Monkey | number> = new Map();
  const resolved: Map<string, number> = new Map();
  const toResolve: Monkey[] = [];

  split(input).forEach((line) => {
    const [name, content] = line.split(': ');

    const n = parseInt(content, 10);
    if (n) {
      if (name !== 'humn') {
        resolved.set(name, n);
        monkeys.set(name, n);
      }
    } else {
      const [a, op, b] = content.split(' ');
      const m = { name, a, b, op: op as Operator };
      toResolve.push(m);
      monkeys.set(name, m);
    }
  });

  // Resolve what we can
  let lastLength = toResolve.length;
  let i = 0;
  while (toResolve.length) {
    const cur = toResolve[i];

    if (resolved.has(cur.a) && resolved.has(cur.b)) {
      resolved.set(cur.name, resolve[cur.op](resolved.get(cur.a)!, resolved.get(cur.b)!));

      toResolve.splice(i, 1);
    } else {
      i += 1;
    }

    if (i === toResolve.length) {
      if (toResolve.length === lastLength) {
        break;
      } else {
        lastLength = toResolve.length;
      }
    }

    i %= toResolve.length;
  }

  let next = 'root';
  const ordered: { a: string | number, b: string | number, op: Operator }[] = [];

  // Simplify + order the unresolved monkeys starting from the root
  while (next !== 'humn') {
    const m = monkeys.get(next)! as Monkey;

    const ra = resolved.get(m.a);
    const rb = resolved.get(m.b);
    ordered.push({ a: ra ?? m.a, b: rb ?? m.b, op: m.op });

    next = typeof ra === 'number' ? m.b : m.a;
  }

  let v = ordered[0].b as number;

  // Apply the reverse operation for each step
  for (let j = 1; j < ordered.length; j += 1) {
    const { a, b, op } = ordered[j]!;

    v = reverseOperation[op](v, a, b);
  }

  return v;
};
