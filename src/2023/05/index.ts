import { split } from '@lib/processing';

type Range = {
  start: number;
  end: number;
};

type RangeMap = Range & {
  offset: number;
};

type Section = RangeMap[];

const parseInput = (input: string): [number[], Section[]] => {
  const [seeds, ...rest] = split(input, '\n\n');

  const initialValues = seeds.split(' ').slice(1).map((s) => parseInt(s, 10));
  const sections = rest.map((s) => s.split('\n').slice(1).map((range) => {
    const [dest, src, length] = range.split(' ').map((v) => parseInt(v, 10));
    return {
      start: src,
      end: src + length - 1,
      offset: dest - src,
    };
  }).sort((a, b) => a.start - b.start));

  return [initialValues, sections];
};

export const part1 = (input: string): number => {
  const [values, sections] = parseInput(input);

  for (const maps of sections) {
    for (const [i, v] of values.entries()) {
      let target = v;
      for (const map of maps) {
        if (v < map.start || v > map.end) {
          continue;
        } else {
          target += map.offset;
          break;
        }
      }

      values[i] = target;
    }
  }

  return Math.min(...values);
};

export const part2 = (input: string): number => {
  const [initialValues, sections] = parseInput(input);
  const ranges: Range[] = [];

  for (let i = 0; i < initialValues.length; i += 2) {
    // -1 because it's a range *inclusive* of the start
    ranges.push({ start: initialValues[i], end: initialValues[i] + initialValues[i + 1] - 1 });
  }

  for (const maps of sections) {
    for (const range of ranges) {
      for (const map of maps) {
        if (range.end < map.start || range.start > map.end) {
          // Range does not overlap this mapping
          continue;
        } else if (range.start < map.start && range.end <= map.start) {
          // End is within the mapping
          ranges.push({ start: range.start, end: map.start - 1 });
          range.start = map.start;
        } else if (range.start >= map.start && range.end > map.end) {
          // Start is within the mapping
          ranges.push({ start: map.end + 1, end: range.end });
          range.end = map.end;
        }

        range.start += map.offset;
        range.end += map.offset;

        // We've updated the portion that overlaps this range; move on to the next one
        break;
      }
    }
  }

  return Math.min(...ranges.map((r) => r.start));
};
