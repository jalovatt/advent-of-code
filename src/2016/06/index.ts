import { split } from '@lib/processing';

const solve = (input: string, takeLeastCommon = false): string => {
  const lines = split(input);

  const counts: Record<string, number>[] = new Array(lines[0].length)
    .fill(null).map(() => ({}));

  for (let i = 0; i < lines.length; i += 1) {
    for (let j = 0; j < lines[i].length; j += 1) {
      const c = lines[i][j];
      counts[j][c] = (counts[j][c] || 0) + 1;
    }
  }

  const str: string[] = [];

  for (let i = 0; i < counts.length; i += 1) {
    const entries = Object.entries(counts[i]).sort((a, b) => b[1] - a[1]);

    const index = takeLeastCommon ? entries.length - 1 : 0;
    str.push(entries[index][0]);
  }

  return str.join('');
};

export const part1 = solve;
export const part2 = (input: string): string => solve(input, true);
