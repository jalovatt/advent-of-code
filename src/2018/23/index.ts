import { split } from '@lib/processing';

type Point3 = {
  x: number;
  y: number;
  z: number;
};

interface Bot extends Point3 {
  x: number;
  y: number;
  z: number;
  r: number;
  inRange: Bot[];
}

const ORIGIN: Point3 = { x: 0, y: 0, z: 0 };

const manhattan = (a: Point3, b: Point3 = ORIGIN): number => Math.abs(
  Math.abs(a.x - b.x)
  + Math.abs(a.y - b.y)
  + Math.abs(a.z - b.z),
);

const parseInput = (str: string): Bot[] => split(str, '\n')
  .map((line) => {
    const [x, y, z, r] = Array.from(line.matchAll(/([-\d]+)/g))
      .map((match) => parseInt(match[0], 10));

    return { x, y, z, r, inRange: [] };
  });

const buildNetwork = (bots: Bot[]) => {
  for (let i = 0; i < bots.length - 1; i += 1) {
    for (let j = i + 1; j < bots.length; j += 1) {
      const a = bots[i];
      const b = bots[j];

      const d = manhattan(a, b);

      if (d <= a.r) {
        a.inRange.push(b);
      }

      if (d <= b.r) {
        b.inRange.push(a);
      }
    }
  }
};

export const part1 = (input: string): number => {
  const bots = parseInput(input);
  buildNetwork(bots);

  // # in range of the bot with max(r)
  return 1 + bots.reduce((acc, cur) => (
    cur.r > acc.r ? cur : acc
  )).inRange.length;
};

export const part2 = (input: string): number => {
  const bots = parseInput(input);
  buildNetwork(bots);
  // find the point in range of the largest number of nanobots
  // if multiple, closest to origin

  // find the bot in range of the most other bots
  const inRangeOf: Map<Bot, Bot[]> = new Map();
  bots.forEach((b) => {
    b.inRange.forEach((irb) => {
      if (!inRangeOf.has(irb)) {
        inRangeOf.set(irb, []);
      }

      inRangeOf.get(irb)!.push(b);
    });
  });

  const irEntries = Array.from(inRangeOf.entries());
  const inRangeOfMost = irEntries.reduce((acc, cur) => (
    cur[1].length > acc[1].length
      ? cur
      : (cur[1].length === acc[1].length && manhattan(cur[0]) < manhattan(acc[0]))
        ? cur
        : acc
  ))[0];

  // Search outward for a

  // What is the shortest manhattan distance between any of those points and 0,0,0?

  // Find the bot with the most in range, and search outward from there for a
  // max?
};
