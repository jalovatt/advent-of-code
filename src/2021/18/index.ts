import { split as splitInput } from '@lib/processing';

const Digits = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export const add = (l: string, r: string): string => `[${l},${r}]`;

export const explode = (s: string): string => {
  let depth = 0;

  let explodeStart = 0;

  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    if (c === '[') {
      depth += 1;
    } else if (c === ']') {
      depth -= 1;
    } else if (depth > 4 && Digits.has(c)) {
      explodeStart = i;
      break;
    }
  }

  if (!explodeStart) { return s; }

  const explodeFinish = s.indexOf(']', explodeStart);

  let lChars = '';
  let rChars = '';
  let seenComma = false;
  for (let i = explodeStart; i < explodeFinish; i += 1) {
    const c = s[i];

    if (c === ',') {
      seenComma = true;
    } else if (seenComma) {
      rChars += s[i];
    } else {
      lChars += s[i];
    }
  }

  const l = parseInt(lChars, 10);
  const r = parseInt(rChars, 10);

  let lTargetStart = 0;
  let lTargetFinish = 0;

  for (let i = explodeStart - 1; i > 0; i -= 1) {
    if (Digits.has(s[i])) {
      lTargetFinish = i;
      break;
    }
  }

  if (lTargetFinish) {
    for (let i = lTargetFinish - 1; i > 0; i -= 1) {
      if (!Digits.has(s[i])) {
        lTargetStart = i + 1;
        break;
      }
    }
  }

  let rTargetStart = 0;
  let rTargetFinish = 0;

  for (let i = explodeFinish + 1; i < s.length; i += 1) {
    if (Digits.has(s[i])) {
      rTargetStart = i;
      break;
    }
  }

  if (rTargetStart) {
    for (let i = rTargetStart + 1; i < s.length; i += 1) {
      if (!Digits.has(s[i])) {
        rTargetFinish = i - 1;
        break;
      }
    }
  }

  if (!(lTargetStart || rTargetStart)) { return s; }

  let lValue;
  if (lTargetStart) {
    lValue = l + parseInt(s.substring(lTargetStart, lTargetFinish + 1), 10);
  }

  let rValue;
  if (rTargetStart) {
    rValue = r + parseInt(s.substring(rTargetStart, rTargetFinish + 1), 10);
  }

  const lSide = (lValue)
    ? `${s.substring(0, lTargetStart)}${lValue}${s.substring(lTargetFinish + 1, explodeStart - 1)}`
    : s.substring(0, explodeStart - 1);

  const rSide = (rValue)
    ? `${s.substring(explodeFinish + 1, rTargetStart)}${rValue}${s.substring(rTargetFinish + 1)}`
    : s.substring(explodeFinish + 1);

  return `${lSide}0${rSide}`;
};

export const split = (s: string): string => {
  let splitStart = 0;
  let splitFinish = 0;

  for (let i = 0; i < s.length; i += 1) {
    if (Digits.has(s[i]) && Digits.has(s[i + 1])) {
      let j = i + 1;
      while (Digits.has(s[j])) {
        j += 1;
      }

      splitStart = i;
      splitFinish = j;
      break;
    }
  }

  if (!splitStart) { return s; }

  const before = parseInt(s.substring(splitStart, splitFinish), 10);
  const half = before / 2;
  const after = [Math.floor(half), Math.ceil(half)];

  return `${s.substring(0, splitStart)}[${after[0]},${after[1]}]${s.substring(splitFinish)}`;
};

export const reduce = (s: string): string => {
  let cur = s;
  let didExplode = false;
  let didSplit = false;
  do {
    didExplode = false;
    didSplit = false;

    let next = cur;

    do {
      cur = next;
      next = explode(cur);
      if (next !== cur) {
        didExplode = true;
      }
    } while (next !== cur);

    next = split(cur);
    if (next !== cur) {
      didSplit = true;
      cur = next;
    }
  } while (didExplode || didSplit);

  return cur;
};

export const sum = (arr: string[]): string => (
  arr.reduce((acc, cur) => reduce(add(acc, cur)))
);

type Node = number | [Node, Node];
const arrayMagnitude = (arr: Node): number => {
  if (!arr) { return 0; }
  if (typeof arr === 'number') { return arr; }

  const l = (typeof arr[0] === 'number') ? arr[0] : arrayMagnitude(arr[0]!);
  const r = (typeof arr[1] === 'number') ? arr[1] : arrayMagnitude(arr[1]!);

  return (3 * l + 2 * r);
};

export const magnitude = (str: string): number => {
  const parsed = JSON.parse(str);

  return arrayMagnitude(parsed);
};

export const a = (input: string) => {
  const arr = splitInput(input);

  return magnitude(sum(arr));
};

export const b = (input: string) => {
  const lines = splitInput(input);

  let max = 0;

  for (let i = 0; i < lines.length - 1; i += 1) {
    for (let j = i + 1; j < lines.length; j += 1) {
      const localMax = Math.max(
        magnitude(sum([lines[i], lines[j]])),
        magnitude(sum([lines[j], lines[i]])),
      );

      max = Math.max(max, localMax);
    }
  }

  return max;
};
