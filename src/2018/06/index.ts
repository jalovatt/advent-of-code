import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

type Pos = [number, number];
type Area = { id: number, origin: Pos, size: number, toVisit: Pos[] };

const posCache: Pos[][] = [];
const getPos = (y: number, x:number): Pos => {
  if (posCache[y]?.[x]) { return posCache[y][x]; }
  if (!posCache[y]) { posCache[y] = []; }

  const p: Pos = [y, x];
  posCache[y][x] = p;

  return p;
};

const neighboursAtDistance = (o: Pos, distance: number): Pos[] => {
  const points: Set<Pos> = new Set();

  for (let y = 0; y <= distance; y += 1) {
    points.add(getPos(o[0] + y, o[1] + distance - y));
    points.add(getPos(o[0] - y, o[1] + distance - y));
    points.add(getPos(o[0] - y, o[1] - (distance - y)));
    points.add(getPos(o[0] + y, o[1] - (distance - y)));
  }

  return Array.from(points);
};

export const part1 = (input: string): number => {
  const areas: Area[] = split(input).map((line, i) => {
    const origin = line.match(/\d+/g)!.map((n) => parseInt(n, 10)).reverse() as Pos;
    return { id: i, origin: getPos(...origin), size: 1, toVisit: [] };
  });

  const ownedPoints: Map<Pos, number> = new Map(areas.map((a, i) => [a.origin, i]));
  const activeAreas: Set<number> = new Set(new Array(areas.length).fill(null).map((_, i) => i));

  let d = 1;

  // Arbitrary, tested with a much larger value to get the right answer
  const BREAK_AFTER_TIMES_SINCE = 40;
  let timesSinceAnAreaBecameInactive = 0;

  const breaker = new CircuitBreaker(1000);
  while (!breaker.hasTripped) {
    breaker.tick();

    const hasGrown: Set<number> = new Set();

    const claims: Map<Pos, number[]> = new Map();
    for (let i = 0; i < areas.length; i += 1) {
      if (!activeAreas.has(i)) { continue; }

      const neighbours = neighboursAtDistance(areas[i].origin, d);

      for (let j = 0; j < neighbours.length; j += 1) {
        if (ownedPoints.has(neighbours[j])) { continue; }

        if (!claims.has(neighbours[j])) {
          claims.set(neighbours[j], []);
        }

        claims.get(neighbours[j])!.push(i);
      }
    }

    claims.forEach((claimants, pos) => {
      if (claimants.length === 1) {
        ownedPoints.set(pos, claimants[0]);
        hasGrown.add(claimants[0]);
        areas[claimants[0]].size += 1;
      } else {
        ownedPoints.set(pos, -1);
      }
    });

    for (let i = 0; i < areas.length; i += 1) {
      if (activeAreas.has(i) && !hasGrown.has(i)) {
        activeAreas.delete(i);
        timesSinceAnAreaBecameInactive = 0;
      }
    }

    timesSinceAnAreaBecameInactive += 1;

    if (timesSinceAnAreaBecameInactive >= BREAK_AFTER_TIMES_SINCE) {
      break;
    }

    d += 1;
  }

  const finite = areas.filter((_, i) => !activeAreas.has(i));
  finite.sort((a, b) => b.size - a.size);

  return finite[0].size;
};

const getMedian = (points: Pos[]): Pos => {
  const yAll = points.map((p) => p[0]);
  const xAll = points.map((p) => p[1]);

  yAll.sort((a, b) => a - b);
  xAll.sort((a, b) => a - b);

  return [
    yAll[(yAll.length / 2) >> 0],
    xAll[(xAll.length / 2) >> 0],
  ];
};

const manhattan = (ya: number, xa: number, yb: number, xb: number) => (
  Math.abs(ya - yb) + Math.abs(xa - xb)
);

export const part2 = (input: string, maxSum: number): number => {
  const sources: Pos[] = split(input).map((line) => (
    getPos(...(line.match(/\d+/g)!.map((n) => parseInt(n, 10)).reverse() as Pos))
  ));

  const origin = getMedian(sources);

  let count = 1;
  let d = 1;
  let addedPoints = false;

  const checkNeighbour = (y: number, x: number): boolean => {
    let sum = 0;

    for (let j = 0; j < sources.length; j += 1) {
      sum += manhattan(y, x, sources[j][0], sources[j][1]);

      if (sum >= maxSum) { break; }
    }

    return sum < maxSum;
  };

  do {
    addedPoints = false;

    const neighbours = neighboursAtDistance(origin, d);

    for (let i = 0; i < neighbours.length; i += 1) {
      if (checkNeighbour(neighbours[i][0], neighbours[i][1])) {
        count += 1;
        addedPoints = true;
      }
    }

    d += 1;
  } while (addedPoints);

  return count;
};
