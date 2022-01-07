import { split } from '@lib/processing';

type StrNum = Record<string, number>;
type Operation = { op: string, l?: string | number, r: string | number };

const SIXTEEN_BIT_MASK = 0b1111111111111111;

export const resolve = (operation: Operation, resolved: StrNum): number => {
  const l = typeof operation.l === 'number'
    ? operation.l
    : (operation.l ? resolved[operation.l] : undefined);
  const r = typeof operation.r === 'number' ? operation.r : resolved[operation.r];

  switch (operation.op) {
    case 'AND': return (l! & r);
    case 'OR': return (l! | r);
    case 'NOT': return ((~r) & SIXTEEN_BIT_MASK) >>> 0;
    case 'LSHIFT': return (l! << r);
    case 'RSHIFT': return (l! >>> r);
    case 'ASSIGN': return r;
    default: throw new Error(`Invalid operation: ${operation.op}`);
  }
};

export const run = (input: string, overrideB?: number): Record<string, number> => {
  const operations: Record<string, Operation> = {};
  const isDependedOnBy: Record<string, string[]> = {};
  const resolved: StrNum = {};
  const unresolvedDepCount: StrNum = {};
  const toUpdate: string[] = [];

  split(input).forEach((line) => {
    const [, left, right] = line.match(/(.+) -> (.+)/)!;

    const needs = left.match(/\b([a-z]+)\b/g)!;

    // This operation depends on another
    if (needs) {
      for (let j = 0; j < needs.length; j += 1) {
        if (!isDependedOnBy[needs[j]]) {
          isDependedOnBy[needs[j]] = [];
        }

        isDependedOnBy[needs[j]].push(right);
      }

      unresolvedDepCount[right] = needs.length;

      const match = left.match(/(?<l>\w+ )?(?<op>\w+) (?<r>\w+)/);

      operations[right] = match
        ? {
          r: parseInt(match.groups!.r, 10) || match.groups!.r,
          op: match.groups!.op,
          l: (match.groups!.l)
            ? (parseInt(match.groups!.l, 10) || match.groups!.l.trim())
            : undefined,
        } : {
          op: 'ASSIGN',
          r: left,
        };

    // This is one of the inputs
    } else {
      resolved[right] = parseInt(left, 10);
      toUpdate.push(right);
    }
  });

  if (overrideB !== undefined) {
    resolved.b = overrideB;
  }

  while (toUpdate.length) {
    const cur = toUpdate.pop()!;

    for (let i = 0; i < isDependedOnBy[cur].length; i += 1) {
      const dep = isDependedOnBy[cur][i];

      unresolvedDepCount[dep] -= 1;

      if (unresolvedDepCount[dep] === 0) {
        resolved[dep] = resolve(operations[dep], resolved);

        if (isDependedOnBy[dep]) {
          toUpdate.push(dep);
        }
      }
    }
  }

  return resolved;
};

export const part1 = (input: string): number => run(input).a;
export const part2 = (input: string): number => run(input, run(input).a).a;
