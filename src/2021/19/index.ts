/* eslint-disable no-labels */
import circuitBreaker from '@lib/circuitBreaker';
import { dir } from '@lib/logging';
import { split } from '@lib/processing';
import rotations, { Rotation } from './rotations';

type Vec3 = { x: number, y: number, z: number };

interface Scanner extends Vec3 {
  beacons: Beacon[];
  orientation: number;
}

type Beacon = Vec3;

type ScannerBeacon = [number, number];
type CorrespondingBeacons = [ScannerBeacon, ScannerBeacon];

const addVec3 = (l: Vec3, r: Vec3): Vec3 => ({
  x: l.x + r.x,
  y: l.y + r.y,
  z: l.z + r.z,
});

const subVec3 = (l: Vec3, r: Vec3): Vec3 => ({
  x: l.x - r.x,
  y: l.y - r.y,
  z: l.z - r.z,
});

const eqlVec3 = (l: Vec3, r: Vec3): boolean => (
  l.x === r.x && l.y === r.y && l.z === r.z
);

export const determinant = (r: Rotation): number => (
  (r[0][0] * (r[1][1] * r[2][2] - r[1][2] * r[2][1]))
  - (r[0][1] * (r[1][0] * r[2][2] - r[1][2] * r[2][0]))
  + (r[0][2] * (r[1][0] * r[2][1] - r[1][1] * r[2][0]))
);

export const rotateVec3 = (v: Vec3, r: number): Vec3 => {
  if (r === 0) { return v; }
  const rotation = rotations[r];

  if (!rotation) { throw new Error(`rotation ${r} does not exist`); }

  return {
    x: v.x * rotation[0][0] + v.y * rotation[0][1] + v.z * rotation[0][2],
    y: v.x * rotation[1][0] + v.y * rotation[1][1] + v.z * rotation[1][2],
    z: v.x * rotation[2][0] + v.y * rotation[2][1] + v.z * rotation[2][2],
  };
};

/*
  Skipping the sqrt for perf; we don't need the distance, just a unique value
*/
const distanceSquared = (l: Vec3, r: Vec3): number => (
  (r.x - l.x) ** 2 + (r.y - l.y) ** 2 + (r.z - l.z) ** 2
);

const manhattanDistance = (v: Vec3): number => Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);

/**
 * Find the intersection of two arrays. Use `needLength > 0` will return early
 * if the intersection can't meet the required size
 */
const intersection = <T>(l: T[], r: T[], needLength = 0): T[] | null => {
  const s = new Set();
  const int: T[] = [];

  for (let i = 0; i < l.length; i += 1) {
    s.add(l[i]);
  }

  for (let i = 0; i < r.length; i += 1) {
    if (needLength && int.length + (r.length - i) < needLength) {
      return null;
    }

    if (s.has(r[i])) {
      int.push(r[i]);
    }
  }

  return int;
};

/**
 * Find all elements in `l` that are not also in `r`
 */
export const subtraction = <T>(l: T[], r: T[], prop = null): T[] => {
  const s = new Set();
  const int: T[] = [];

  for (let i = 0; i < r.length; i += 1) {
    s.add(prop ? r[i][prop] : r[i]);
  }

  for (let i = 0; i < l.length; i += 1) {
    if (!s.has(prop ? l[i][prop] : l[i])) {
      int.push(l[i]);
    }
  }

  return int;
};

const transformScanner = (s: Scanner, r: number, offset: Vec3): Scanner => {
  if (s.x || s.y || s.z) { throw new Error('Scanner has already been transformed'); }

  const transformed = addVec3(s, offset) as Scanner;
  transformed.orientation = r;
  transformed.beacons = [];

  for (let bi = 0; bi < s.beacons.length; bi += 1) {
    const b = s.beacons[bi];
    transformed.beacons.push(addVec3(rotateVec3(b, r), offset) as Beacon);
  }

  return transformed;
};

const findTransform = (
  corr: CorrespondingBeacons[],
  scanners: Scanner[],
  sourceOnRight = false,
): [number, Vec3] => {
  const sourceIndex = sourceOnRight ? 1 : 0;
  const targetIndex = sourceOnRight ? 0 : 1;

  const first = corr[0];
  const sourceFirst = first[sourceIndex];
  const targetFirst = first[targetIndex];

  let r = 0;
  let offset: Vec3;

  while (r < rotations.length) {
    const target = subVec3(
      scanners[sourceFirst[0]].beacons[sourceFirst[1]],
      rotateVec3(scanners[targetFirst[0]].beacons[targetFirst[1]], r),
    );

    let match = true;

    for (let i = 1; i < corr.length; i += 1) {
      const diff = subVec3(
        scanners[corr[i][sourceIndex][0]].beacons[corr[i][sourceIndex][1]],
        rotateVec3(scanners[corr[i][targetIndex][0]].beacons[corr[i][targetIndex][1]], r),
      );

      if (!eqlVec3(diff, target)) {
        match = false;
        break;
      }
    }

    if (match) {
      offset = target;
      break;
    }

    r += 1;
  }

  if (r === rotations.length) {
    throw new Error(`Couldn't find a rotation to match scanners ${corr[0][0][0]}, ${corr[0][1][0]}`);
  }

  return [r, offset!];
};

const registerScanners = (input: string) => {
  const scanners = split(input, /\n*--- scanner \d+ ---\n/).map((rawScanner): Scanner => {
    const beacons = split(rawScanner).map((rawBeacon): Beacon => {
      const values = rawBeacon.split(',');

      const x = parseInt(values[0], 10);
      const y = parseInt(values[1], 10);
      const z = parseInt(values[2], 10);

      return { x, y, z };
    });

    return {
      x: 0,
      y: 0,
      z: 0,
      orientation: 0,
      beacons,
    };
  });

  // Remove an extra scanner we get from processing the first line
  scanners.shift();

  const pairwiseDistances: Record<number, number[][]> = {};
  for (let si = 0; si < scanners.length; si += 1) {
    const s = scanners[si];
    pairwiseDistances[si] = [];
    for (let i = 0; i < s.beacons.length; i += 1) {
      if (!pairwiseDistances[si][i]) {
        pairwiseDistances[si][i] = [];
      }

      for (let j = i + 1; j < s.beacons.length; j += 1) {
        if (!pairwiseDistances[si][j]) {
          pairwiseDistances[si][j] = [];
        }

        const d = distanceSquared(s.beacons[i], s.beacons[j]);
        pairwiseDistances[si][i][j] = d;
        pairwiseDistances[si][j][i] = d;
      }
    }
  }

  const overlaps: [ScannerBeacon, ScannerBeacon, number[]][] = [];

  for (let i = 0; i < scanners.length - 1; i += 1) {
    for (let j = i + 1; j < scanners.length; j += 1) {
      /*
        Perf: If we haven't found a match after 12 beacons, there aren't enough left
        to get a match.

        Thanks @ https://www.reddit.com/r/adventofcode/comments/rk1smr/comment/hpa1ux4/?utm_source=share&utm_medium=web2x&context=3
      */
      beaconLoop:
      for (let k = 0; k < 12; k += 1) {
        for (let l = 0; l < 12; l += 1) {
          const b1Distances = pairwiseDistances[i][k];
          const b2Distances = pairwiseDistances[j][l];

          const int = intersection(b1Distances, b2Distances, 12);
          if (!int) { continue; }
          if (int.length >= 12) {
            overlaps.push([[i, k], [j, l], int]);
            break beaconLoop;
          }
        }
      }
    }
  }

  const correspondingToCheck: CorrespondingBeacons[][] = [];

  for (let i = 0; i < overlaps.length; i += 1) {
    const l = overlaps[i][0];
    const r = overlaps[i][1];
    const distances = overlaps[i][2];

    const corr: CorrespondingBeacons[] = [];

    for (let j = 0; j < distances.length; j += 1) {
      const d = distances[j];

      if (!d) { continue; }

      const lCorresponding = pairwiseDistances[l[0]][l[1]].indexOf(d);
      const rCorresponding = pairwiseDistances[r[0]][r[1]].indexOf(d);

      corr.push([[l[0], lCorresponding], [r[0], rCorresponding]]);
    }

    correspondingToCheck.push(corr);
  }

  const knownScanners: Set<number> = new Set([0]);

  while (correspondingToCheck.length) {
    circuitBreaker(100, () => {
      dir({ knownScanners, correspondingToCheck });
    });

    const c = correspondingToCheck.shift()!;
    const lScanner = c[0][0][0];
    const rScanner = c[0][1][0];

    let sourceScanner!: number;
    let targetScanner!: number;
    if (knownScanners.has(lScanner)) {
      if (knownScanners.has(rScanner)) {
        continue;
      }

      sourceScanner = lScanner;
      targetScanner = rScanner;
    } else if (knownScanners.has(rScanner)) {
      sourceScanner = rScanner;
      targetScanner = lScanner;
    }

    if (sourceScanner === undefined) {
      correspondingToCheck.push(c);
      continue;
    }

    const found = findTransform(c, scanners, sourceScanner === rScanner);

    const src = scanners[targetScanner];
    scanners[targetScanner] = transformScanner(src, found[0], found[1]);
    knownScanners.add(targetScanner);
  }

  return scanners;
};

export const a = (input: string): string[] => {
  const scanners = registerScanners(input);

  const merged: Set<string> = new Set();

  for (let si = 0; si < scanners.length; si += 1) {
    const s = scanners[si];
    for (let bi = 0; bi < s.beacons.length; bi += 1) {
      const b = s.beacons[bi];
      merged.add(`${b.x},${b.y},${b.z}`);
    }
  }

  return Array.from(merged);
};

export const b = (input: string): number => {
  const scanners = registerScanners(input);

  let max = 0;

  for (let l = 0; l < scanners.length - 1; l += 1) {
    for (let r = l + 1; r < scanners.length; r += 1) {
      const v = subVec3(scanners[l], scanners[r]);
      max = Math.max(max, manhattanDistance(v));
    }
  }

  return max;
};
