import { dir, log } from '../../utilities/logging';

type TargetBounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number,
};

class Probe {
  bounds: TargetBounds;
  vx: number;
  vy: number;
  ovx: number;
  ovy: number;
  x: number;
  y: number;
  yMax: number;

  constructor(vx: number, vy: number, bounds: TargetBounds) {
    this.ovx = vx;
    this.ovy = vy;

    this.x = 0;
    this.y = 0;
    this.yMax = 0;
    this.vx = vx;
    this.vy = vy;
    this.bounds = bounds;
  }

  checkBounds(): boolean {
    return this.bounds.xMin <= this.x
      && this.y <= this.bounds.yMax
      && !this.pastBounds();
  }

  pastBounds(): boolean {
    return this.x > this.bounds.xMax || this.y < this.bounds.yMin;
  }

  step() {
    this.x += this.vx;
    this.y += this.vy;

    this.yMax = Math.max(this.yMax, this.y);

    this.vx -= Math.sign(this.vx);
    this.vy -= 1;
  }

  run(): boolean {
    while (!this.pastBounds()) {
      this.step();

      if (this.checkBounds()) {
        // log(`probe in bounds @ ${this.x},${this.y}, yMax = ${this.yMax}`);
        return true;
      }
    }

    return false;
  }
}

const triangularNumbersCache: Record<number, number> = {};
const nthTriangularNumber = (n) => {
  if (!triangularNumbersCache[n]) {
    triangularNumbersCache[n] = (n * (n + 1)) / 2;
  }

  return triangularNumbersCache[n];
};

// TODO: Wrong
const trianglesBetweenBounds = (nMin: number, triangleMax: number): number[] => {
  const valid = [];
  let cur = nMin;
  while (nthTriangularNumber(cur) - cur <= triangleMax) {
    valid.push(cur);

    cur += 1;
  }

  return valid;
};

const findSolutions = (input: string): Probe[] => {
  const match: number[] = input.match(/([-1234567890]+)/g)!.map((n) => parseInt(n, 10))!;
  const bounds = {
    xMin: match[0],
    xMax: match[1],
    yMin: match[2],
    yMax: match[3],
  };

  /*
    Any starting vx less than this will never get us there

    vxMin = The lowest number s.t. n + n-1 + n-2... + 1 >= xMin

    The sum of the first n numbers = n(n+1)/2, which rearranges into a
    quadratic equation to find the minimum n for a given sum
  */
  const vxMin = Math.floor((Math.sqrt(8 * bounds.xMin + 1) - 1) / 2);

  /*
    vxMax = first step is the only step to land in the bounds
  */
  const vxMax = bounds.xMax;

  // // TODO: Fancy math later
  // /*
  //   For a given vx s.t. vxMin <= vx <= vxMax, find which steps it will be
  //   within the bounds on
  // */

  // /*
  //   TODO: Are we sure of this?
  // */
  // let minStepsToGetThereX = vxMin;
  // let totalDistanceWithMinVx = (vxMin * (vxMin + 1)) / 2;

  // for (let i = vxMin; i > 0; i -= 1) {
  //   totalDistanceWithMinVx -= i;
  //   if (totalDistanceWithMinVx < bounds.xMin) {
  //     break;
  //   }

  //   minStepsToGetThereX -= 1;
  // }

  // const solutions = [];
  // let maxY = 0;

  // /*
  //   Find vy s.t. at minStepsToGetThereX y >= bounds.yMin (has not fallen too far)

  //   Probe will cross y = 0 at step 2vy. Every subsequent step n, probe will be at
  //   y = -(sum of first n numbers)

  //   When vy hits 0, at step vy, probe will be at y = (sum of first vy numbers)

  //   Probe's position at step n =
  //     n <=
  // */

  const vxValid = trianglesBetweenBounds(vxMin, bounds.xMax);
  log(`got ${vxValid} valid vx values`);

  const solutions = [];

  dir({ bounds, vxMin, vxMax });
  for (let vx = vxMin; vx <= vxMax; vx += 1) {
    for (let vy = bounds.yMin; vy <= 100; vy += 1) {
      const probe = new Probe(vx, vy, bounds);
      const hitTarget = probe.run();

      if (hitTarget) {
        // log(`probe hit target with v = ${vx},${vy}, probe @ ${probe.x}, ${probe.y}, yMax = ${probe.yMax}`);
        solutions.push(probe);
      }
    }
  }

  // log(`hit ${solutions.length} of ${count} tries`);
  // dir(new Set(solutions.map((p) => p.ovx)));

  return solutions;
}

export const a = (input: string) => {
  const solutions = findSolutions(input);

  return Math.max(...solutions.map((s) => s.yMax));
};

export const b = (input: string) => {
  const solutions = findSolutions(input);

  return solutions.length;
};
