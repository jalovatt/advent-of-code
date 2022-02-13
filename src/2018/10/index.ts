import CircuitBreaker from '@lib/CircuitBreaker';
import { dir, log } from '@lib/logging';
import { split } from '@lib/processing';

type Vec2 = { x: number, y: number };
type Point = { p: Vec2, v: Vec2 };

const mutAdd = (a: Vec2, b: Vec2): Vec2 => {
  a.x += b.x;
  a.y += b.y;

  return a;
};

const mutSub = (a: Vec2, b: Vec2): Vec2 => {
  a.x -= b.x;
  a.y -= b.y;

  return a;
};

const magnitude = (v: Vec2): number => Math.abs(v.x) + Math.abs(v.y);

type Bounds = { min: Vec2, max: Vec2 };
const bounds = (arr: Point[]): Bounds => {
  const min: Vec2 = { x: arr[0].p.x, y: arr[0].p.y };
  const max: Vec2 = { x: arr[0].p.x, y: arr[0].p.y };

  for (let i = 1; i < arr.length; i += 1) {
    const cur = arr[i];
    if (cur.p.x < min.x) {
      min.x = cur.p.x;
    } else if (cur.p.x > max.x) {
      max.x = cur.p.x;
    }

    if (cur.p.y < min.y) {
      min.y = cur.p.y;
    } else if (cur.p.y > max.y) {
      max.y = cur.p.y;
    }
  }

  return { min, max };
};

const compactness = (arr: Point[]): number => {
  const b = bounds(arr);

  return magnitude(mutSub(b.max, b.min));
};

const print = (arr: Point[]) => {
  const b = bounds(arr);

  const field = new Array(b.max.y - b.min.y + 1).fill(null).map(() => new Array(b.max.x - b.min.x + 1).fill('.'));

  for (let i = 0; i < arr.length; i += 1) {
    const cur = arr[i];

    if (!field[cur.p.y - b.min.y]) {
      dir({ b, cur, field }, { depth: 3 });
    }

    field[cur.p.y - b.min.y][cur.p.x - b.min.x] = '#';
  }

  log(field.map((row) => row.join('')).join('\n'));
};

const solve = (input: string, shouldPrint = false): number => {
  const points: Point[] = split(input).map((line) => {
    const [px, py, vx, vy] = line.match(/[-\d]+/g)!.map((n) => parseInt(n, 10));

    return { p: { x: px, y: py }, v: { x: vx, y: vy } };
  });

  let t = 0;
  let lastCompactness = Number.MAX_SAFE_INTEGER;

  const advance = () => {
    for (let i = 0; i < points.length; i += 1) {
      mutAdd(points[i].p, points[i].v);
    }
  };

  const reverse = () => {
    for (let i = 0; i < points.length; i += 1) {
      mutSub(points[i].p, points[i].v);
    }
  };

  const breaker = new CircuitBreaker(100000);
  while (!breaker.hasTripped) {
    breaker.tick();

    advance();

    const c = compactness(points);

    if (c > lastCompactness) {
      break;
    }

    lastCompactness = c;

    t += 1;
  }

  if (shouldPrint) {
    reverse();
    print(points);
  }

  return t;
};

export const part1 = (input: string): number => solve(input, true);
export const part2 = solve;
