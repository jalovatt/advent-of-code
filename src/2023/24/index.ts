import { dir, log } from '@lib/logging';
import { split } from '@lib/processing';

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

type Particle3 = {
  p: Vec3;
  v: Vec3;
};

class Vector {
  static add(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z } as Vec3;
  }

  static sub(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z } as Vec3;
  }

  static equal(a: Vec3, b: Vec3): boolean {
    return (a.x === b.x) && (a.y === b.y) && (a.z === b.z);
  }

  static stringify(v: Vec3) {
    return `${v.x}, ${v.y}, ${v.z}`;
  }
}

class Particle {
  static positionAt(v: Particle3, t: number): Vec3 {
    return {
      x: v.p.x + (v.v.x * t),
      y: v.p.y + (v.v.y * t),
      z: v.p.z + (v.v.z * t),
    };
  }

  static stringify(p: Particle3): string {
    return `${Vector.stringify(p.p)} @ ${Vector.stringify(p.v)}`;
  }
}

const ACCEPTABLE_DIFFERENCE = 0.001;
const equalEnough = (a: Vec3, b: Vec3): boolean => {
  const dx = a.x - b.x;
  if ((dx > 0 ? dx : -dx) > ACCEPTABLE_DIFFERENCE) { return false; }
  const dy = a.y - b.y;
  if ((dy > 0 ? dy : -dy) > ACCEPTABLE_DIFFERENCE) { return false; }
  const dz = a.z - b.z;
  if ((dz > 0 ? dz : -dz) > ACCEPTABLE_DIFFERENCE) { return false; }
  return true;
};

const inBounds = (p: Vec3, min: number, max: number, includeZ = false): boolean => (
  p.x >= min && p.x <= max
  && p.y >= min && p.y <= max
  && (!includeZ || (p.z >= min && p.z <= max))
);

const parseInput = (input: string, part2 = false): Particle3[] => split(input).map((line) => {
  const [px, py, pz, vx, vy, vz] = [...line.matchAll(/([-\d]+)/g)].map((match) => parseInt(match[0], 10));

  return part2
    ? { p: { x: px, y: py, z: pz }, v: { x: vx, y: vy, z: vz } }
    : { p: { x: px, y: py, z: 0 }, v: { x: vx, y: vy, z: 0 } };
});

export const part1 = (input: string, minBound: number, maxBound: number): number => {
  const parsed = parseInput(input);

  let intersections = 0;

  for (let i = 0; i < parsed.length - 1; i += 1) {
    for (let j = i + 1; j < parsed.length; j += 1) {
      const a = parsed[i];
      const b = parsed[j];

      // const t = (b.p.y - b.p.x + a.p.x - a.p.y) / (a.v.y - a.v.x);
      // const intersection = Particle.positionAt(a, t);

      const avyoveravx = a.v.y / a.v.x;
      const bvyoverbvx = b.v.y / b.v.x;

      const tNum = a.p.y - b.p.y - (bvyoverbvx * a.p.x) + (bvyoverbvx * b.p.x);
      const tDen = (bvyoverbvx * a.v.x) - a.v.y;
      const t = tNum / tDen;

      const uNum = b.p.y - a.p.y - (avyoveravx * b.p.x) + (avyoveravx * a.p.x);
      const uDen = (avyoveravx * b.v.x) - b.v.y;
      const u = uNum / uDen;

      const intersection = Particle.positionAt(b, u);

      // const t = (b.p.x + (u * a.v.x) - b.p.x) / a.v.x;
      // const u = (a.p.x + (t * (a.v.x - b.p.x))) / b.v.x;
      // const u = (b.p.y - b.p.x + a.p.x - a.p.y) / (a.v.y - a.v.x);
      // dir({
      //   a,
      //   t,
      //   'a @ t': Particle.positionAt(a, t),
      //   b,
      //   u,
      //   'b @ u': Particle.positionAt(b, u),
      //   in: inBounds(intersection, minBound, maxBound),
      //   eq: equalEnough(intersection, Particle.positionAt(b, u)),
      //   minBound,
      //   maxBound,
      // });

      const isInbounds = inBounds(intersection, minBound, maxBound);
      const isEqualEnough = equalEnough(intersection, Particle.positionAt(b, u));

      const aStr = Particle.stringify(a);
      const bStr = Particle.stringify(b);

      // log(`\n${aStr}\n${bStr}`);

      if (t <= 0) {
        // log(u <= 0 ? `Crossed in the past for both @ t = ${t}/u = ${u}` : `Crossed in the past for A @ t = ${t}`);
      } else if (u <= 0) {
        // log(`Crossed in the past for B @ u = ${u}`);
      } else if (!isInbounds) {
        // log(`Will cross outside of bounds @ ${Vector.stringify(intersection)} @ t = ${t}/u = ${u}`);
      } else if (!isEqualEnough) {
        // log(`Unequal:\n\tint A = ${Vector.stringify(intersection)}\n\tint B = ${Vector.stringify(Particle.positionAt(b, u))}`);
      } else if (
        t > 0
        && u > 0
        && isInbounds
        && isEqualEnough
      ) {
        // log(`Will cross inside of bounds @ ${intersection.x}, ${intersection.y}, ${intersection.z} @ t = ${t}/u = ${u}`);
        intersections += 1;
      } else {
        // log('??');
      }
    }
  }

  return intersections;
};
export const part2 = (input: string): number => {
  const parsed = parseInput(input, true);

  dir(parsed);
};
