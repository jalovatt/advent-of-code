import { dir, log } from '@lib/logging';
import { split } from '@lib/processing';

type Sensor = { x: number, y: number, r: number, xNeeded: number }

const manhattan = (
  ax: number,
  ay: number,
  bx: number,
  by: number,
) => Math.abs(ax - bx) + Math.abs(ay - by);

export const part1 = (input: string, row: number): number => {
  const sensors: Sensor[] = [];
  const rowBeacons: Set<number> = new Set();

  let rangeMin = Infinity;
  let rangeMax = -Infinity;

  split(input).forEach((line) => {
    const [, sx, sy, bx, by] = line.split(/[^-\d]+/).map((n) => parseInt(n, 10));

    const r = manhattan(sx, sy, bx, by);
    const xNeeded = r - Math.abs(sy - row);

    // This sensor's radius covers the target row
    if (Math.abs(sy - row) <= r) {
      // log(`using sensor @ ${sx},${sy}`);
      sensors.push({
        x: sx,
        y: sy,
        r,
        /*
          Precomputing the y portion of the manhattan distance. This can save
          a good chunk of time over the full run.
        */
        xNeeded,
      });
    }

    if (by === row) {
      rowBeacons.add(bx);
    }

    rangeMin = Math.min(rangeMin, sx - xNeeded, bx);
    rangeMax = Math.max(rangeMax, sx + xNeeded, bx);
  });

  sensors.sort((a, b) => a.x - b.x);

  let iLast = 0;
  const spaces: Set<number> = new Set();

  for (let x = rangeMin; x <= rangeMax; x += 1) {
    if (rowBeacons.has(x)) {
      continue;
    }

    /*
      The last sensor that covered a space is the first one that could possibly
      cover the next one, so we can save a small amount of time by skipping the
      sensors before it.
    */
    for (let i = iLast; i < sensors.length; i += 1) {
      const s = sensors[i];

      // This is WAY faster than Math.abs
      let xDistance = s.x - x;
      if (xDistance < 0) {
        xDistance *= -1;
      }

      if (xDistance <= s.xNeeded) {
        spaces.add(x);
        iLast = i;
        break;
      }
    }
  }

  return spaces.size;
};

export const part2 = (input: string, range: number): number => {
  const sensors: Sensor[] = [];

  split(input).forEach((line) => {
    const [, sx, sy, bx, by] = line.split(/[^-\d]+/).map((n) => parseInt(n, 10));

    const r = manhattan(sx, sy, bx, by);

    const s = { x: sx, y: sy, r };
  });
};
