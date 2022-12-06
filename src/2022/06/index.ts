const compare = (arr: string[]): boolean => {
  for (let a = 0; a < arr.length - 1; a += 1) {
    for (let b = a + 1; b < arr.length; b += 1) {
      if (arr[a] === arr[b]) {
        return false;
      }
    }
  }

  return true;
};

const rotate = (arr: string[], next: string) => {
  for (let i = 0; i < arr.length - 1; i += 1) {
    arr[i] = arr[i + 1];
  }

  arr[arr.length - 1] = next;
};

const solve = (input: string, n: number): number => {
  const arr = new Array(n).fill(null).map((_, i) => input[i]);
  let i = n - 1;

  while (i < input.length) {
    if (compare(arr)) {
      break;
    }

    i += 1;

    rotate(arr, input[i]);
  }

  return i + 1;
};

export const part1 = (input: string) => solve(input, 4);
export const part2 = (input: string) => solve(input, 14);
