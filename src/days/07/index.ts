import { splitToNumber } from '../../utilities/processing';
import { selectMedian } from './median';

const nthTriangularNumber = (n: number) => (n * (n + 1)) / 2;

export const a = (input: string) => {
  const crabs = splitToNumber(input, ',');

  const median = selectMedian(crabs);

  let totalFuel = 0;
  crabs.forEach((crab) => { totalFuel += Math.abs(crab - median); });

  return totalFuel;
};

export const b = (input: string) => {
  const crabs = splitToNumber(input, ',');

  // Wild guess that, because of weighting, the mean will be closer to the answer
  // than the median was.
  const mean = crabs.reduce((acc, cur) => acc + cur, 0) / crabs.length;
  const target = Math.round(mean);

  let minCost = Number.MAX_SAFE_INTEGER;

  for (let t = target - 5; t < target + 5; t += 1) {
    let totalFuel = 0;
    crabs.forEach((crab) => {
      const distance = Math.abs(crab - t);
      totalFuel += nthTriangularNumber(distance);
    });

    if (totalFuel < minCost) {
      minCost = totalFuel;
    } else {
      break;
    }
  }

  return minCost;
};
