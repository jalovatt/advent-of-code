import { split } from '@lib/processing';

export const part1 = (input: string): number => {
  let x = 1;
  let i = 0;
  let cycle = 1;

  const notable: number[] = [];
  const lines = split(input);

  while (cycle < 220) {
    const line = lines[i % lines.length];

    const [, arg] = line.split(' ');
    const v = parseInt(arg, 10);

    const nCycles = !Number.isNaN(v) ? 2 : 1;

    for (let c = 0; c < nCycles; c += 1) {
      if (!((cycle - 20) % 40)) {
        notable.push(cycle * x);
      }

      cycle += 1;
    }

    if (v) {
      x += v;
    }

    i += 1;
  }

  return notable.reduce((acc, cur) => acc + cur);
};

export const part2 = (input: string): string => {
  const lines = split(input);
  let x = 1;
  let i = 0;
  let cycle = 0;

  const screen: ('#' | '.')[][] = new Array(6).fill(null).map(() => new Array(40).fill('.'));

  while (cycle < 240) {
    const line = lines[i % lines.length];

    const [, arg] = line.split(' ');
    const v = parseInt(arg, 10);

    const nCycles = !Number.isNaN(v) ? 2 : 1;

    for (let c = 0; c < nCycles; c += 1) {
      const sx = cycle % 40;
      const sy = (cycle / 40) >> 0;

      if (Math.abs(x - sx) <= 1) {
        screen[sy][sx] = '#';
      }

      cycle += 1;
    }

    if (v) {
      x += v;
    }

    i += 1;
  }

  return screen.map((row) => row.join('')).join('\n');
};
