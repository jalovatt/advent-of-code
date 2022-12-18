import { split, splitToNumber } from '@lib/processing';

type Vec3 = { x: number, y: number, z: number };

const NEIGHBOURS: Vec3[] = [
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: -1 },
  { x: 0, y: 0, z: 1 },
];

//
const BUFFER = 10;

const hash = (x: number, y: number, z: number): number => (
  ((((x + BUFFER) << 8) + y + BUFFER) << 8) + z + BUFFER
);

const get = {
  x: (n: number) => (n >> 16) - BUFFER,
  y: (n: number) => ((n >> 8) & 0b11111111) - BUFFER,
  z: (n: number) => (n & 0b11111111) - BUFFER,
};

export const part1 = (input: string): number => {
  const points: number[] = [];
  const set: Set<number> = new Set();

  split(input).forEach((line) => {
    const [x, y, z] = splitToNumber(line, ',');

    const n = hash(x, y, z);
    points.push(n);
    set.add(n);
  });

  let exposed = 0;

  points.forEach((p) => {
    const x = get.x(p);
    const y = get.y(p);
    const z = get.z(p);

    NEIGHBOURS.forEach((n) => {
      const other = hash(x + n.x, y + n.y, z + n.z);

      if (!set.has(other)) {
        exposed += 1;
      }
    });
  });

  return exposed;
};

export const part2 = (input: string): number => {
  const set: Set<number> = new Set();

  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: 0, y: 0, z: 0 };

  split(input).forEach((line) => {
    const [x, y, z] = splitToNumber(line, ',');

    const n = hash(x, y, z);
    set.add(n);

    if (x < min.x) { min.x = x; }
    if (x > max.x) { max.x = x; }

    if (y < min.y) { min.y = y; }
    if (y > max.y) { max.y = y; }

    if (z < min.z) { min.z = z; }
    if (z > max.z) { max.z = z; }
  });

  /*
    We need some padding to make sure the flood fill can reach a "pocket" in a
    face along one of the boundary planes, i.e.

    bound ---------------
           ~~####!#####~~
           ~############~

    Cheers to Reddit, I was stuck here with +/- 1 and thought it should be enough.
  */
  min.x -= 2;
  min.y -= 2;
  min.z -= 2;

  max.x += 2;
  max.y += 2;
  max.z += 2;

  let exteriorFaces = 0;
  const toVisit: number[] = [hash(min.x, min.y, min.z)];
  const visited: Set<number> = new Set();

  while (toVisit.length) {
    const cur = toVisit.pop()!;

    const x = get.x(cur);
    const y = get.y(cur);
    const z = get.z(cur);

    for (let i = 0; i < NEIGHBOURS.length; i += 1) {
      const n = NEIGHBOURS[i];

      const nx = x + n.x;
      const ny = y + n.y;
      const nz = z + n.z;
      const other = hash(nx, ny, nz);

      if (set.has(other)) {
        exteriorFaces += 1;
      } else if (
        !visited.has(other)
        && (min.x <= nx && nx <= max.x)
        && (min.y <= ny && ny <= max.y)
        && (min.z <= nx && nz <= max.z)
      ) {
        visited.add(other);
        toVisit.push(other);
      }
    }
  }

  return exteriorFaces;
};
