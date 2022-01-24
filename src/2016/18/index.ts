import { split } from '@lib/processing';

const SAFE = '.';
const TRAP = '^';

type Tile = typeof SAFE | typeof TRAP;

export const solve = (input: string, rows: number): number => {
  const arrs: [Tile[], Tile[]] = [split(input, '') as Tile[], []];

  let count = arrs[0].reduce((acc, cur) => acc + (cur === SAFE ? 1 : 0), 0);
  let activeIndex = 1;

  let i = 1;
  while (i < rows) {
    const prev = arrs[1 - activeIndex];
    const next = arrs[activeIndex];

    for (let j = 0; j < prev.length; j += 1) {
      const a = prev[j - 1] || SAFE;
      const b = prev[j];
      const c = prev[j + 1] || SAFE;

      const isTrap = ((a !== b && a !== c) || (c !== a && c !== b));
      next[j] = isTrap ? TRAP : SAFE;
      if (!isTrap) { count += 1; }
    }

    i += 1;
    activeIndex = 1 - activeIndex;
  }

  return count;
};
