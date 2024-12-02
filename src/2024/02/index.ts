import { split } from '@lib/processing';

const compareLevels = (a: number, b: number, direction: boolean): boolean => {
  if (a < b !== direction) {
    return false;
  }

  const diff = Math.abs(b - a);
  if (diff < 1 || diff > 3) {
    return false;
  }

  return true;
};

function* rowPermutations(row: number[]) {
  for (let i = 0; i < row.length; i += 1) {
    const subrow = [...row];
    subrow.splice(i, 1);

    yield subrow;
  }
}

const checkRow = (row: number[], allowOneUnsafe = false): boolean => {
  const direction = row[0] < row[1];

  for (let j = 0; j < row.length - 1; j += 1) {
    const a = row[j];
    const b = row[j + 1];

    if (compareLevels(a, b, direction)) {
      continue;
    }

    if (allowOneUnsafe) {
      const permutationGenerator = rowPermutations(row);

      for (const perm of permutationGenerator) {
        if (checkRow(perm)) {
          return true;
        }
      }
    }
    return false;
  }

  return true;
};

const check = (input: string, part2 = false): number => {
  const parsed = split(input).map((row) => row.split(' ').map(Number));

  let safe = 0;

  for (let i = 0; i < parsed.length; i += 1) {
    const row = parsed[i];

    if (checkRow(row, part2)) {
      safe += 1;
    }
  }

  return safe;
};

export const part1 = check;
export const part2 = (input: string) => check(input, true);
