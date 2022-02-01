const CANCEL = '!';
const GARBAGE = { OPEN: '<', CLOSE: '>' };
const GROUP = { OPEN: '{', CLOSE: '}' };

export const part1 = (input: string, countGarbage = false): number => {
  const completed: number[] = [];
  let currentDepth = 0;
  let isGarbage = false;
  let garbageCount = 0;

  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (c === CANCEL) {
      i += 1;
    } else if (isGarbage) {
      if (c === GARBAGE.CLOSE) {
        isGarbage = false;
      } else {
        garbageCount += 1;
      }
    } else if (c === GROUP.CLOSE) {
      completed.push(currentDepth);
      currentDepth -= 1;
      isGarbage = false;
    } else if (c === GROUP.OPEN) {
      currentDepth += 1;
    } else if (c === GARBAGE.OPEN) {
      isGarbage = true;
    }
  }

  return countGarbage
    ? garbageCount
    : completed.reduce((acc, cur) => acc + cur);
};

export const part2 = (input: string): number => part1(input, true);
