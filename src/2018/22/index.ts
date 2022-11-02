import CircuitBreaker from '@lib/CircuitBreaker';
import { dir, inspect, log } from '@lib/logging';
import { FibonacciHeap, INode } from '@tyriar/fibonacci-heap';

enum RegionType { Rocky, Wet, Narrow }
const RegionTypeStrings: Record<RegionType, string> = {
  [RegionType.Rocky]: '.',
  [RegionType.Wet]: '=',
  [RegionType.Narrow]: '|',
};

type Region = {
  x: number,
  y: number,
  gi: number,
  el: number,
  type: RegionType,
  neighbours: Region[],
};

enum Gear { Torch, Climb, None }

const allowedGear: Record<RegionType, Set<Gear>> = {
  [RegionType.Rocky]: new Set([Gear.Climb, Gear.Torch]),
  [RegionType.Wet]: new Set([Gear.Climb, Gear.None]),
  [RegionType.Narrow]: new Set([Gear.Torch, Gear.None]),
};

type Explorer = { pos: Region, gear: Gear, visited: Set<Region>, time: number };
interface ExplorerNode extends INode<number, Explorer> { value: Explorer }

const EQUIP_TIME = 7;
const MOD = 20183;

const gearIntersection = (a: Region, b: Region): Gear => {
  for (let i = 0; i < 3; i += 1) {
    if (allowedGear[a.type].has(i as Gear) && allowedGear[b.type].has(i as Gear)) {
      return i as Gear;
    }
  }

  throw new Error('!');
};

const neighbours = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/*
  Input depth is ~12k, so we can safely use 14 bits (16383) per axis
*/
const encodePos = (y: number, x: number) => (y << 14) | x;
const decodePos = {
  x: (p: number) => p & ((1 << 14) - 1),
  y: (p: number) => p >>> 14,
};

const incrementPos = {
  x: (p: number, v: number) => p + v,
  y: (p: number, v: number) => p + (v << 14),
};

const connectRegions = (a: Region, b: Region) => {
  a.neighbours.push(b);
  b.neighbours.push(a);
};

const parseInput = (input: string): [number, number, number] => {
  const [d, x, y] = input.match(/\d+/g)!;

  return [parseInt(d, 10), parseInt(y, 10), parseInt(x, 10)];
};

const buildMap = (depth: number, ty: number, tx: number, yPad: number, xPad: number): Map<number, Region> => {
  const addRegionType = (r: Region) => { r.type = r.el % 3 as RegionType; };
  const addErosionLevel = (r: Region) => { r.el = (depth + r.gi) % MOD; };

  const map: Map<number, Region> = new Map();

  for (let y = 0; y <= ty + yPad; y += 1) {
    for (let x = 0; x <= tx + xPad; x += 1) {
      const r = {
        x,
        y,
        neighbours: [] as Region[],
      } as Region;

      if ((y === 0 && x === 0)) {
        r.gi = 0;
      } else {
        const left = map.get(encodePos(y, x - 1))!;
        const up = map.get(encodePos(y - 1, x))!;

        if (y === ty && x === tx) {
          r.gi = 0;
        } else if (y === 0) {
          r.gi = x * 16807;
        } else if (x === 0) {
          r.gi = y * 48271;
        } else {
          r.gi = left.el * up.el;
        }

        if (left) { connectRegions(r, left); }
        if (up) { connectRegions(r, up); }
      }

      addErosionLevel(r);
      addRegionType(r);
      map.set(encodePos(y, x), r);
    }
  }

  return map;
};

export const part1 = (input: string): number => {
  const [depth, ty, tx] = parseInput(input);
  const map = buildMap(depth, ty, tx, 0, 0);

  let risk = 0;
  for (const v of map.values()) {
    risk += v.type as number;
  }

  return risk;
};

const manhattan = (a: Region, b: Region) => Math.abs(a.y - b.y) + Math.abs(a.x - b.x);

export const part2 = (input: string): number => {
  const [depth, ty, tx] = parseInput(input);
  const map = buildMap(depth, ty, tx, 500, 200);

  const start = map.get(encodePos(0, 0))!;
  const end = map.get(encodePos(ty, tx))!;

  const shortestTimes: Map<Region, number> = new Map();
  // shortestTimes.set(start, 0);

  const toCheck: FibonacciHeap<number, Explorer> = new FibonacciHeap();
  toCheck.insert(0, {
    pos: start,
    visited: new Set([start]),
    gear: Gear.Torch,
    time: 0,
  });

  // const checkInsert = (cost: number, e: Explorer) => {
  //   const existing = shortestTimes.get(e.pos);

  //   if (existing !== undefined && e.time >= existing) {
  //     return;
  //   }

  //   shortestTimes.set(e.pos, e.time);
  //   toCheck.insert(cost, e);
  // };

  const solutions: number[] = [];

  const breaker = new CircuitBreaker(100000, (cur) => { log(`${toCheck.size()} remaining, cur = ${inspect(cur.value.pos)}`); });
  while (!toCheck.isEmpty()) {
    const cur = toCheck.extractMinimum() as ExplorerNode;

    // const existing = shortestTimes.get(cur.value.pos);

    // if (existing !== undefined && cur.value.time >= existing) {
    //   continue;
    // }

    // shortestTimes.set(cur.value.pos, cur.value.time);

    breaker.tick(cur);

    const r = cur.value.pos;
    if (r === end) {
      // dir(cur.value);
      // log(Array.from(shortestTimes).sort((a, b) => (
      //   (a[0].x - b[0].x || a[0].y - b[0].y)
      // )).map(([region, v]) => `${region.y},${region.x} = ${v}`).join('\n'));

      solutions.push(cur.value.gear === Gear.Torch
        ? cur.value.time
        : cur.value.time + EQUIP_TIME);

      if (solutions.length >= 10) {
        break;
      }
    }

    for (let i = 0; i < cur.value.pos.neighbours.length; i += 1) {
      const n = cur.value.pos.neighbours[i];

      if (cur.value.visited.has(n)) {
        continue;
      }

      let next = {
        pos: n,
        gear: cur.value.gear,
        time: cur.value.time + 1,
        visited: new Set(cur.value.visited),
      };

      next.visited.add(n);
      if (allowedGear[n.type].has(next.gear)) {
        toCheck.insert(next.time + manhattan(next.pos, end), next);
      } else {
        next = { ...next };
        next.time += EQUIP_TIME;

        next.gear = gearIntersection(cur.value.pos, next.pos);
        toCheck.insert(next.time + manhattan(next.pos, end), next);
      }
    }
  }

  dir(solutions);

  log(`finished after ${breaker.n} ticks`);
};
