type Segment = string | SegmentCount[];
type SegmentCount = [Segment, number];

const recurseDecompress = (input: string, recursive = false): SegmentCount[] => {
  const str = input.trim();

  const segments: SegmentCount[] = [];

  let lastPushEnd = 0;
  let parenStart: number | null = null;
  let i = 0;
  while (i < str.length) {
    if (str[i] === '(') {
      const segment = str.slice(lastPushEnd, i);
      segments.push([segment, 1]);
      parenStart = i;

      lastPushEnd = i;
    } else if (str[i] === ')' && parenStart !== null) {
      const marker = str.slice(parenStart + 1, i);
      const match = marker.match(/(\d+)x(\d+)/)!;
      const l = parseInt(match[1], 10);
      const n = parseInt(match[2], 10);

      const copyEnd = i + l;
      let segment: string | Segment = str.slice(i + 1, copyEnd + 1);

      if (recursive) {
        segment = recurseDecompress(segment, recursive);
      }

      segments.push([segment, n]);

      parenStart = null;
      lastPushEnd = copyEnd + 1;
      i = copyEnd;
    }

    i += 1;
  }

  const segment = str.slice(lastPushEnd);
  segments.push([segment, 1]);

  return segments;
};

const countSegments = (segments: SegmentCount[]): number => {
  let count = 0;

  for (let i = 0; i < segments.length; i += 1) {
    const s = segments[i];
    if (typeof s[0] === 'string') {
      count += s[0].length * s[1];
    } else {
      count += countSegments(s[0]) * s[1];
    }
  }

  return count;
};

export const part1 = (input: string): number => {
  const segments = recurseDecompress(input);

  return countSegments(segments);
};

export const part2 = (input: string): number => {
  const segments = recurseDecompress(input, true);

  return countSegments(segments);
};
