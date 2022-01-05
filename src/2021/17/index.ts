import { log } from '../../utilities/logging';

type TargetBounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number,
};

type ShotResult = { vx: number, vy: number, yMax: number };

enum CheckBoundsResult {
  Short,
  Hit,
  Far,
}

const checkBounds = (x: number, y: number, bounds: TargetBounds): CheckBoundsResult => {
  if (x > bounds.xMax || y < bounds.yMin) { return CheckBoundsResult.Far; }
  if (x < bounds.xMin || y > bounds.yMax) { return CheckBoundsResult.Short; }

  return CheckBoundsResult.Hit;
};

const triangularNumbersCache: Record<number, number> = {};
const nthTriangularNumber = (n: number) => {
  if (!triangularNumbersCache[n]) {
    triangularNumbersCache[n] = (n * (n + 1)) / 2;
  }

  return triangularNumbersCache[n];
};

/*
  All n s.t. triangle(n) lands within the bounds _on some step_

  6     5     4    3   2  1 0
  |_____|_____|____|___|__|_|
                 xxxx

  sum(6 5 4 3 2 1)  no
  sum(6 5 4 3 2)    no
  sum(6 5 4 3)      no
  sum(6 5 4)        yes
*/
const trianglesBetweenBounds = (nMin: number, nMax: number, bounds: TargetBounds): number[] => {
  const valid = [nMin, nMax];

  for (let n = nMin + 1; n < nMax; n += 1) {
    let pos = nthTriangularNumber(n);
    let cur = 0;

    while (cur < n) {
      pos -= cur;

      if (bounds.xMin <= pos && pos <= bounds.xMax) {
        valid.push(n);
        break;
      }

      cur += 1;
    }
  }

  return valid;
};

const findSolutions = (input: string): ShotResult[] => {
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
  const vxValid = trianglesBetweenBounds(vxMin, vxMax, bounds);

  const vyValidSet: Set<number> = new Set();

  /*
    All vy s.t. it's in-bounds on some step
    150 is an arbitrary limit, high enough that my result stops changing
  */
  for (let ovy = bounds.yMin; ovy <= 150; ovy += 1) {
    let cur = 0;
    let vy = ovy;

    while (cur > bounds.yMin) {
      cur += vy;
      vy -= 1;

      if (cur <= bounds.yMax && cur >= bounds.yMin) {
        vyValidSet.add(ovy);
        break;
      }
    }
  }

  const solutions = [];
  // let count = 0;
  for (const vx of vxValid) {
    for (const vy of vyValidSet) {
      let x = 0;
      let y = 0;

      let vyCur = vy;
      let vxCur = vx;

      // count += 1;

      let yMax = 0;

      while (x < bounds.xMax && y > bounds.yMin) {
        x += vxCur;
        y += vyCur;

        vxCur -= Math.sign(vxCur);
        vyCur -= 1;

        if (vyCur === 0) { yMax = y; }

        const result = checkBounds(x, y, bounds);

        if (result === CheckBoundsResult.Hit) {
          solutions.push({ vx, vy, yMax });
          break;
        } else if (result === CheckBoundsResult.Far) {
          break;
        }
      }
    }
  }

  // log(`hit ${solutions.length} of ${count}`);
  // log(`naive would have used ${vxMax - vxMin} * ${150 - bounds.yMin} = ${(vxMax - vxMin) * (100 - bounds.yMin)} tries`);

  return solutions;
};

export const a = (input: string) => {
  const solutions = findSolutions(input);

  return Math.max(...solutions.map((s) => s.yMax));
};

export const b = (input: string) => findSolutions(input).length;
