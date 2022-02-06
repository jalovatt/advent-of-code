import { split } from '@lib/processing';

enum Pixel { On = '#', Off = '.' }
export enum Axis { Y, X }

type Pattern = Pixel[][];

type ParsedInput = {
  patternsByLine: Map<string, Pattern>,
  rules: Map<string, string>,
};

const START = `
.#.
..#
###
`;

export const lineToPattern = (line: string): Pattern => line
  .split('/')
  .map((row) => row.split('') as Pixel[]);

export const patternToLine = (p: Pattern): string => p.map((row) => row.join('')).join('/');

const blankPattern = (n: number): Pattern => new Array(n).fill(null).map(() => new Array(n).fill('.'));

export const rotate = (p: Pattern): Pattern => {
  const out = blankPattern(p.length);
  const offset = p.length - 1;

  for (let y = 0; y < p.length; y += 1) {
    for (let x = 0; x < p.length; x += 1) {
      out[y][x] = p[x][offset - y];
    }
  }

  return out;
};

export const flip = (p: Pattern, axis: Axis): Pattern => {
  const out = blankPattern(p.length);
  const offset = p.length - 1;

  for (let y = 0; y < p.length; y += 1) {
    for (let x = 0; x < p.length; x += 1) {
      if (axis === Axis.X) {
        out[y][x] = p[y][offset - x];
      } else {
        out[y][x] = p[offset - y][x];
      }
    }
  }

  return out;
};

const parseInput = (input: string): ParsedInput => {
  const out: ParsedInput = {
    patternsByLine: new Map(),
    rules: new Map(),
  };

  const add = (line: string, p: Pattern, outLine: string) => {
    out.patternsByLine.set(line, p);
    out.rules.set(line, outLine);
  };

  split(input).forEach((line) => {
    const [src, outLine] = line.split(' => ');

    const outPattern = lineToPattern(outLine);
    out.patternsByLine.set(outLine, outPattern);

    let srcPattern = lineToPattern(src);
    let srcKey = src;

    add(srcKey, srcPattern, outLine);

    for (let i = 0; i < 3; i += 1) {
      srcPattern = rotate(srcPattern);
      srcKey = patternToLine(srcPattern);

      add(srcKey, srcPattern, outLine);

      let flippedPattern = flip(srcPattern, Axis.X);
      let flippedKey = patternToLine(flippedPattern);
      add(flippedKey, flippedPattern, outLine);

      flippedPattern = flip(srcPattern, Axis.Y);
      flippedKey = patternToLine(flippedPattern);
      add(flippedKey, flippedPattern, outLine);
    }
  });

  return out;
};

const countPixelsOn = (p: Pattern): number => p.reduce((acc, row) => (
  acc + row.reduce((rowAcc, col) => rowAcc + (col === Pixel.On ? 1 : 0), 0)
), 0);

const extractLine = (y: number, x: number, size: number, pattern: Pattern): string => {
  const out: string[] = [];

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      out.push(pattern[y + i][x + j]);
    }

    if (i !== size - 1) {
      out.push('/');
    }
  }

  return out.join('');
};

const mutApplyToPattern = (base: Pattern, y: number, x: number, subPattern: Pattern) => {
  for (let i = 0; i < subPattern.length; i += 1) {
    for (let j = 0; j < subPattern.length; j += 1) {
      base[y + i][x + j] = subPattern[i][j];
    }
  }
};

export const solve = (input: string, iterations: number): number => {
  const { patternsByLine, rules } = parseInput(input);
  let pattern = split(START).map((line) => line.split('')) as Pattern;

  let t = 0;
  while (t < iterations) {
    const [
      srcSquareSize,
      outSquareSize,
      nextSize,
    ] = (pattern.length % 2 === 0)
      ? [2, 3, (pattern.length / 2) * 3]
      : [3, 4, (pattern.length / 3) * 4];

    const next = blankPattern(nextSize);

    const limit = pattern.length / srcSquareSize;
    for (let y = 0; y < limit; y += 1) {
      for (let x = 0; x < limit; x += 1) {
        const lineIn = extractLine(y * srcSquareSize, x * srcSquareSize, srcSquareSize, pattern);

        const lineOut = rules.get(lineIn)!;
        const matchedPattern = patternsByLine.get(lineOut)!;

        mutApplyToPattern(next, y * outSquareSize, x * outSquareSize, matchedPattern);
      }
    }

    pattern = next;
    t += 1;
  }

  return countPixelsOn(pattern);
};
