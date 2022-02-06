import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

type Vec3 = { x: number, y: number, z: number };
type Particle = { i: number, p: Vec3, v: Vec3, a: Vec3, manhattan: number };
interface CollidableParticle extends Particle { hasCollided: boolean }

const abs = (x: number) => {
  const y = x >> 31;
  return (x ^ y) - y;
};

const stringify = (v: Vec3) => `${v.x},${v.y},${v.z}`;
const manhattan = (v: Vec3) => abs(v.x) + abs(v.y) + abs(v.z);

const mutAdd = (a: Vec3, b: Vec3) => {
  a.x += b.x;
  a.y += b.y;
  a.z += b.z;
};

/*
  I was stuck on part 2 for a good hour before a Reddit comment made me realize
  that the sequence should update V before updating P; I had the reverse.
*/
const mutUpdate = (particle: Particle) => {
  mutAdd(particle.v, particle.a);
  mutAdd(particle.p, particle.v);
  particle.manhattan += manhattan(particle.v);
};

const getParticle = (i: number, components: string[]): Particle => {
  const p = {
    x: parseInt(components[0], 10),
    y: parseInt(components[1], 10),
    z: parseInt(components[2], 10),
  };

  return {
    i,
    p,
    v: {
      x: parseInt(components[3], 10),
      y: parseInt(components[4], 10),
      z: parseInt(components[5], 10),
    },
    a: {
      x: parseInt(components[6], 10),
      y: parseInt(components[7], 10),
      z: parseInt(components[8], 10),
    },
    manhattan: manhattan(p),
  };
};

export const part1 = (input: string): number => {
  const particles: Particle[] = split(input).map((line, i) => {
    const components = line.match(/[-\d]+/g)!;

    return getParticle(i, components);
  });

  let min: number | undefined;

  // Arbitrary; tested with longer values to ensure the right answer
  const breaker = new CircuitBreaker(500);
  while (!breaker.hasTripped) {
    try {
      breaker.tick();
    } catch {
      break;
    }

    min = undefined;

    for (let i = 0; i < particles.length; i += 1) {
      mutUpdate(particles[i]);

      if (min === undefined || particles[i].manhattan < particles[min].manhattan) {
        min = i;
      }
    }
  }

  return min!;
};

export const part2 = (input: string): number => {
  const particles: CollidableParticle[] = split(input).map((line, i) => {
    const components = line.match(/[-\d]+/g)!;

    const particle = getParticle(i, components) as CollidableParticle;
    particle.hasCollided = false;

    return particle;
  });

  // Arbitrary; tested with longer values to ensure the right answer
  const breaker = new CircuitBreaker(100);
  while (!breaker.hasTripped) {
    try {
      breaker.tick();
    } catch {
      break;
    }

    const seen: Record<string, CollidableParticle> = {};

    for (let i = 0; i < particles.length; i += 1) {
      if (particles[i].hasCollided) { continue; }

      mutUpdate(particles[i]);

      const k = stringify(particles[i].p);

      if (seen[k]) {
        seen[k].hasCollided = true;
        particles[i].hasCollided = true;
      } else {
        seen[k] = particles[i];
      }
    }
  }

  return particles.filter((p) => !p.hasCollided).length;
};
