import { lcm } from '@lib/math';
import { split } from '@lib/processing';

type Vec3 = { x: number; y: number; z: number };
type Moon = { pos: Vec3; vel: Vec3 };

const parseInput = (input: string): Moon[] => split(input)
  .map((line) => {
    const result = line.match(/([-\d]+)/g)!;

    return {
      pos: {
        x: parseInt(result[0], 10),
        y: parseInt(result[1], 10),
        z: parseInt(result[2], 10),
      },
      vel: { x: 0, y: 0, z: 0 },
    };
  });

const step = (moons: Moon[]) => {
  // Pairwise, update velocities +/- 1
  for (let j = 0; j < moons.length - 1; j += 1) {
    for (let k = j + 1; k < moons.length; k += 1) {
      const a = moons[j];
      const b = moons[k];

      const dx = Math.sign(b.pos.x - a.pos.x);
      const dy = Math.sign(b.pos.y - a.pos.y);
      const dz = Math.sign(b.pos.z - a.pos.z);

      a.vel.x += dx;
      b.vel.x -= dx;
      a.vel.y += dy;
      b.vel.y -= dy;
      a.vel.z += dz;
      b.vel.z -= dz;
    }
  }

  for (let j = 0; j < moons.length; j += 1) {
    const m = moons[j];

    m.pos.x += m.vel.x;
    m.pos.y += m.vel.y;
    m.pos.z += m.vel.z;
  }
};

const hashAxisState = (moons: Moon[], coord: keyof Vec3): string => (
  moons.reduce<number[]>((acc, cur) => {
    acc.push(cur.pos[coord], cur.vel[coord]);
    return acc;
  }, []).join('/')
);

const totalEnergy = (m: Moon): number => (
  (Math.abs(m.pos.x) + Math.abs(m.pos.y) + Math.abs(m.pos.z))
  * (Math.abs(m.vel.x) + Math.abs(m.vel.y) + Math.abs(m.vel.z))
);

const axes: Array<keyof Vec3> = ['x', 'y', 'z'];

export const part1 = (input: string, steps: number): number => {
  const moons = parseInput(input);

  for (let i = 0; i < steps; i += 1) {
    step(moons);
  }

  return moons.reduce((acc, cur) => acc + totalEnergy(cur), 0);
};

export const part2 = (input: string): number => {
  const moons = parseInput(input);
  const seen = {
    x: new Set(),
    y: new Set(),
    z: new Set(),
  };

  const cycles: Vec3 = { x: 0, y: 0, z: 0 };

  let i = 0;
  while (!cycles.x || !cycles.y || !cycles.z) {
    step(moons);

    /*
      Because the axes never interact, we can find the cycle lengths separately
      and then take their least common multiplier.
    */
    for (const a of axes) {
      if (!cycles[a]) {
        const hash = hashAxisState(moons, a);

        if (seen[a].has(hash)) {
          cycles[a] = i;
        }

        seen[a].add(hash);
      }
    }

    i += 1;
  }

  return lcm(cycles.x, cycles.y, cycles.z);
};
