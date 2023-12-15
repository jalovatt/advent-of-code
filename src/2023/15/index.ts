import { split } from '@lib/processing';

const parseStr = (str: string): number => {
  let total = 0;

  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);

    // Mod by a power of 2 is the same as &ing that many bits;
    total = ((total + code) * 17) & 255;
  }

  return total;
};

export const part1 = (input: string): number => split(input, ',').reduce((acc, cur) => acc + parseStr(cur), 0);

type ParsedDelete = { label: string, hashed: number, op: '-' };
type ParsedAdd = { label: string, hashed: number, op: '=', focalLength: number };
type Parsed = ParsedAdd | ParsedDelete;

export const part2 = (input: string): number => {
  const parsed: Parsed[] = split(input, ',').map((str) => {
    // Ever-so-slightly faster than pulling the values out with a .match(/regex/)
    if (str[str.length - 1] === '-') {
      const label = str.substring(0, str.length - 1);
      return { label, hashed: parseStr(label), op: '-' };
    }

    const opIndex = str.indexOf('=');
    const label = str.substring(0, opIndex);
    const focalLength = str.substring(opIndex + 1);

    return {
      label,
      hashed: parseStr(label),
      op: '=',
      focalLength: parseInt(focalLength, 10) ?? null,
    } as Parsed;
  });

  const boxes: Map<string, ParsedAdd>[] = new Array(256).fill(null).map(() => new Map());

  for (const p of parsed) {
    if (p.op === '=') {
      boxes[p.hashed].set(p.label, p);
    } else {
      boxes[p.hashed].delete(p.label);
    }
  }

  let total = 0;

  for (const [i, b] of boxes.entries()) {
    for (const [j, [, p]] of [...b].entries()) {
      total += (1 + i) * (1 + j) * p.focalLength;
    }
  }

  return total;
};
