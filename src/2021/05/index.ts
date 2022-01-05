import { split } from '@lib/processing';

const findOverlaps = (input: string, includeDiagonals = false): number => {
  const segments = split(input).map((line) => {
    const [, ...coords] = line.match(/(\d+),(\d+) -> (\d+),(\d+)/) as string[];

    return coords.map((n) => parseInt(n, 10));
  });

  let overlaps = 0;
  const field: { [key: string]: number } = {};

  const updateField = (x: number, y: number) => {
    const key = `${x},${y}`;
    field[key] = (field[key] || 0) + 1;
    if (field[key] === 2) {
      overlaps += 1;
    }
  };

  segments.forEach(([x1, y1, x2, y2]) => {
    if (x1 === x2) {
      const sign = Math.sign(y2 - y1);
      const stop = y2 + sign;
      for (let y = y1; y !== stop; y += sign) {
        updateField(x1, y);
      }
    } else if (y1 === y2) {
      const sign = Math.sign(x2 - x1);
      const stop = x2 + sign;
      for (let x = x1; x !== stop; x += sign) {
        updateField(x, y1);
      }
    } else if (includeDiagonals) {
      const n = Math.abs(x2 - x1);
      const xSign = Math.sign(x2 - x1);
      const ySign = Math.sign(y2 - y1);

      for (let i = 0; i <= n; i += 1) {
        const x = x1 + i * xSign;
        const y = y1 + i * ySign;

        updateField(x, y);
      }
    }
  });

  return overlaps;
};

export const a = (input: string) => findOverlaps(input);
export const b = (input: string) => findOverlaps(input, true);
