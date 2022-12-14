import { split } from '@lib/processing';

enum CompareResult { Correct = 1, Equal = 0, Incorrect = -1 }
type List = (number | List)[];

const comparePackets = (left: List, right: List): CompareResult => {
  for (let i = 0; i < left.length; i += 1) {
    const b = right[i];

    if (b === undefined) {
      return CompareResult.Incorrect;
    }

    const a = left[i];

    if (typeof a === 'number' && typeof b === 'number') {
      if (a < b) {
        return CompareResult.Correct;
      }

      if (a > b) {
        return CompareResult.Incorrect;
      }
    } else {
      const childrenCorrect = comparePackets(
        Array.isArray(a) ? a : [a],
        Array.isArray(b) ? b : [b],
      );

      // If the child comparison resolved either way, we can stop
      if (childrenCorrect !== CompareResult.Equal) {
        return childrenCorrect;
      }
    }
  }

  return left.length === right.length
    ? CompareResult.Equal
    : CompareResult.Correct;
};

export const part1 = (input: string): number => {
  const packets = split(input, '\n\n');

  let count = 0;
  packets.forEach((pair, i) => {
    const [leftStr, rightStr] = pair.split('\n');

    const left: List = JSON.parse(leftStr);
    const right: List = JSON.parse(rightStr);

    const result = comparePackets(left, right);
    if (result === CompareResult.Correct) {
      count += i + 1;
    }
  });

  return count;
};

export const part2 = (input: string): number => {
  const packets = split(input, '\n\n').flatMap((pair) => {
    const [leftStr, rightStr] = pair.split('\n');

    return [JSON.parse(leftStr), JSON.parse(rightStr)];
  });

  const dividers = [
    JSON.parse('[[2]]'),
    JSON.parse('[[6]]'),
  ];

  packets.push(...dividers);
  packets.sort((a, b) => comparePackets(b, a));

  return (packets.indexOf(dividers[0]) + 1) * (packets.indexOf(dividers[1]) + 1);
};
