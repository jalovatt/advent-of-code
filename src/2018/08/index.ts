import { splitToNumber } from '@lib/processing';

export const part1 = (input: string): number => {
  const data = splitToNumber(input, ' ');

  const nodeSum = (start: number): [number, number] => {
    const nChildren = data[start];
    const nEntries = data[start + 1];

    let sum = 0;
    let end = 0;
    let cur = start + 2;

    for (let i = 0; i < nChildren; i += 1) {
      const childResult = nodeSum(cur);
      sum += childResult[0];
      end = childResult[1];
      cur = end;
    }

    for (let i = cur; i < cur + nEntries; i += 1) {
      sum += data[i];
    }

    return [sum, cur + nEntries];
  };

  return nodeSum(0)[0];
};

export const part2 = (input: string): number => {
  const data = splitToNumber(input, ' ');

  const nodeValue = (start: number): [number, number] => {
    const nChildren = data[start];
    const nEntries = data[start + 1];

    let value = 0;
    let end = 0;
    let cur = start + 2;

    const childValues: number[] = [];
    if (nChildren > 0) {
      for (let i = 0; i < nChildren; i += 1) {
        const childResult = nodeValue(cur);
        childValues.push(childResult[0]);
        end = childResult[1];
        cur = end;
      }
    }

    for (let i = cur; i < cur + nEntries; i += 1) {
      value += (nChildren > 0)
        ? (childValues[data[i] - 1] ?? 0)
        : data[i];
    }

    return [value, cur + nEntries];
  };

  return nodeValue(0)[0];
};
