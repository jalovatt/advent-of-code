import { split, splitToNumber } from '@lib/processing';

export const part1 = (input: string, n = 256): number => {
  const steps = splitToNumber(input, ',');
  const list = new Array(n).fill(null).map((_, i) => i);

  let cur = 0;
  let skip = 0;

  while (steps.length) {
    const step = steps.shift()!;
    const last = cur + step - 1;
    const stopAt = cur + (last - cur) / 2;

    for (let i = cur; i <= stopAt; i += 1) {
      const l = i % list.length;
      const r = (last - (i - cur) + list.length) % list.length;
      [list[l], list[r]] = [list[r], list[l]];
    }

    cur = (cur + step + skip) % list.length;
    skip += 1;
  }

  return list[0] * list[1];
};

export const part2 = (input: string): string => {
  const steps = split(input, '').map((c) => c.charCodeAt(0));
  steps.push(17, 31, 73, 47, 23);

  const list = new Array(256).fill(null).map((_, i) => i);

  let times = 64;

  let cur = 0;
  let skip = 0;

  while (times) {
    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      const last = cur + step - 1;
      const stopAt = cur + (last - cur) / 2;

      for (let j = cur; j <= stopAt; j += 1) {
        const a = j % list.length;
        const b = (last - (j - cur) + list.length) % list.length;
        [list[a], list[b]] = [list[b], list[a]];
      }

      cur = (cur + step + skip) % list.length;
      skip += 1;
    }

    times -= 1;
  }

  const final: number[] = [];

  for (let i = 0; i < list.length; i += 16) {
    let v = list[i];
    for (let j = i + 1; j < i + 16; j += 1) {
      v ^= list[j];
    }

    final.push(v);
  }

  return final.map((v) => v.toString(16).padStart(2, '0')).join('');
};
