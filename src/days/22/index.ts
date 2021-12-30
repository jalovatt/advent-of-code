/*
  Thanks to @chadjaros - https://github.com/chadjaros/advent-of-code/blob/main/src/utils/point-3d.ts
  for a bunch of 3D math where I had the right idea on paper but no idea how to
  turn it into algebra
*/
import { split } from '../../utilities/processing';

type Maybe<T> = T | null | undefined;

type Point3 = { x: number, y: number, z: number };

type Region3 = {
  a: Point3;
  b: Point3;
};

type Instruction = { value: 1 | 0, a: Point3, b: Point3 };

const intPattern = '[-0123456789]+';
const lineExp = new RegExp(`(\\w+) x=(${intPattern})..(${intPattern}),y=(${intPattern})..(${intPattern}),z=(${intPattern})..(${intPattern})`);

const intersects = (t: Region3, u: Region3): boolean => !(
  t.a.x > u.b.x || u.a.x > t.b.x
  || t.a.y > u.b.y || u.a.y > t.b.y
  || t.a.z > u.b.z || u.a.z > t.b.z
);

const aBounds: Region3 = {
  a: { x: -50.5, y: -50.5, z: -50.5 },
  b: { x: 50.5, y: 50.5, z: 50.5 },
};

const getIntersection = (l: Region3, r: Region3): Region3 => ({
  a: { x: Math.max(l.a.x, r.a.x), y: Math.max(l.a.y, r.a.y), z: Math.max(l.a.z, r.a.z) },
  b: { x: Math.min(l.b.x, r.b.x), y: Math.min(l.b.y, r.b.y), z: Math.min(l.b.z, r.b.z) },
});

const subtractCuboids = (l: Region3, r: Region3): Region3[] => {
  const int = getIntersection(l, r);

  const slices: Region3[] = [];

  if (int.a.z > l.a.z) {
    slices.push({
      a: { x: l.a.x, y: l.a.y, z: l.a.z },
      b: { x: l.b.x, y: l.b.y, z: int.a.z },
    });
  }

  if (int.b.z < l.b.z) {
    slices.push({
      a: { x: l.a.x, y: l.a.y, z: int.b.z },
      b: { x: l.b.x, y: l.b.y, z: l.b.z },
    });
  }

  if (int.a.x > l.a.x) {
    slices.push({
      a: { x: l.a.x, y: l.a.y, z: int.a.z },
      b: { x: int.a.x, y: l.b.y, z: int.b.z },
    });
  }

  if (int.b.x < l.b.x) {
    slices.push({
      a: { x: int.b.x, y: l.a.y, z: int.a.z },
      b: { x: l.b.x, y: l.b.y, z: int.b.z },
    });
  }

  if (int.a.y > l.a.y) {
    slices.push({
      a: { x: int.a.x, y: l.a.y, z: int.a.z },
      b: { x: int.b.x, y: int.a.y, z: int.b.z },
    });
  }

  if (int.b.y < l.b.y) {
    slices.push({
      a: { x: int.a.x, y: int.b.y, z: int.a.z },
      b: { x: int.b.x, y: l.b.y, z: int.b.z },
    });
  }

  return slices;
};

const sumRegionVolumes = (regions: Region3[]): number => {
  let sum = 0;

  for (let i = 0; i < regions.length; i += 1) {
    const r = regions[i];
    sum += (r.b.x - r.a.x) * (r.b.y - r.a.y) * (r.b.z - r.a.z);
  }

  return sum;
};

export const parseLine = (line: string, bounds: Maybe<Region3>): Instruction | false => {
  const matched = line.match(lineExp)!;

  const [, state, x1, x2, y1, y2, z1, z2] = matched;

  // 0.5 corrects for each point being a full cube
  const region: Instruction = {
    value: state === 'on' ? 1 : 0,
    a: { x: parseInt(x1, 10) - 0.5, y: parseInt(y1, 10) - 0.5, z: parseInt(z1, 10) - 0.5 },
    b: { x: parseInt(x2, 10) + 0.5, y: parseInt(y2, 10) + 0.5, z: parseInt(z2, 10) + 0.5 },
  };

  return (!bounds || intersects(bounds, region)) && region;
};

const solve = (input: string, bounds: Maybe<Region3>, stopAt: Maybe<number>) => {
  const instructions = split(input)
    .map((line) => parseLine(line, bounds))
    .filter(Boolean) as Instruction[];

  const existing: Region3[] = [];

  const end = stopAt || instructions.length;

  for (let i = 0; i < end; i += 1) {
    const indicesToIgnore = [];
    const toAdd = [];

    for (let j = 0; j < existing.length; j += 1) {
      const cur = instructions[i];
      const was = existing[j];
      const slices = intersects(was, cur) && subtractCuboids(was, cur);

      // If an intersection, split the existing around it and drop the original
      if (slices) {
        indicesToIgnore.push(j);
        toAdd.push(...slices);
      }
    }

    if (instructions[i].value) { toAdd.push(instructions[i]); }

    if (indicesToIgnore.length) {
      for (let si = indicesToIgnore.length - 1; si >= 0; si -= 1) {
        existing.splice(indicesToIgnore[si], 1);
      }
    }

    existing.push(...toAdd);
  }

  return sumRegionVolumes(existing);
};

export const a = (input: string, stopAt?: Maybe<number>): number => solve(input, aBounds, stopAt);

export const b = (input: string, stopAt?: Maybe<number>) => solve(input, null, stopAt);
