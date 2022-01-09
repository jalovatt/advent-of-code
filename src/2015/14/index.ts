import { split } from '@lib/processing';

type Deer = { v: number, tf: number, tr: number, tc: number };

const parseInput = (input: string): Deer[] => split(input).map((line) => {
  const match = line.match(/(\d+)/g)!;

  const v = parseInt(match[0], 10);
  const tf = parseInt(match[1], 10);
  const tr = parseInt(match[2], 10);

  return { v, tf, tr, tc: tf + tr };
});

export const part1 = (input: string, t: number): number => {
  const allDeer = parseInput(input);

  const positions: number[] = [];
  for (let i = 0; i < allDeer.length; i += 1) {
    const deer = allDeer[i];

    const cycles = (t / deer.tc) >> 0;
    const partCycle = Math.min(t % deer.tc, deer.tf);
    const pos = deer.v * (cycles * deer.tf + partCycle);

    positions.push(pos);
  }

  return positions.sort((a, b) => b - a)[0];
};

const findMaxIndices = (arr: number[]): number[] => {
  let maxIndices = [0];

  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] > arr[maxIndices[0]]) {
      maxIndices = [i];
    } else if (arr[i] === arr[maxIndices[0]]) {
      maxIndices.push(i);
    }
  }

  return maxIndices;
};

export const part2 = (input: string, t: number): number => {
  const allDeer = parseInput(input);

  const scores = new Array(allDeer.length).fill(0);
  const positions = new Array(allDeer.length).fill(0);
  for (let i = 0; i <= t; i += 1) {
    for (let d = 0; d < allDeer.length; d += 1) {
      const deer = allDeer[d];

      if (i % deer.tc < deer.tf) {
        positions[d] += deer.v;
      }
    }

    const maxIndices = findMaxIndices(positions);
    for (let m = 0; m < maxIndices.length; m += 1) {
      scores[maxIndices[m]] += 1;
    }
  }

  return scores.sort((a, b) => b - a)[0];
};
