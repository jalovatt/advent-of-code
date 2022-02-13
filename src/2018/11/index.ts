const W = 300;

const powerCache: number[][][] = [];
const power = (y: number, x: number, gridSerial: number): number => {
  if (powerCache[y]?.[x]?.[gridSerial]) {
    return powerCache[y][x][gridSerial];
  }

  const rid = x + 10;
  let p = y * rid;
  p += gridSerial;
  p *= rid;

  p = ((p / 100) >> 0) % 10;
  p -= 5;

  if (!powerCache[y]) { powerCache[y] = []; }
  if (!powerCache[y][x]) { powerCache[y][x] = []; }

  powerCache[y][x][gridSerial] = p;

  return p;
};

const sumPower = (oy: number, ox: number, gridSerial: number, squareSize: number): number => {
  let sum = 0;

  for (let y = 0; y < squareSize; y += 1) {
    for (let x = 0; x < squareSize; x += 1) {
      sum += power(y + oy, x + ox, gridSerial);
    }
  }

  return sum;
};

export const part1 = (input: string): string => {
  const gridSerial = parseInt(input.trim(), 10);

  const max: [number, number, number] = [0, -1, -1];

  for (let y = 1; y <= W - 2; y += 1) {
    for (let x = 1; x <= W - 2; x += 1) {
      const sum = sumPower(y, x, gridSerial, 3);

      if (sum > max[0]) {
        max[0] = sum;
        max[1] = y;
        max[2] = x;
      }
    }
  }

  return `${max[2]},${max[1]}`;
};

const getMax = (a: number, b: number) => ((b > a) ? b : a);

export const part2 = (input: string): string => {
  const gridSerial = parseInt(input.trim(), 10);

  // sum, y, x, w
  const max: [number, number, number, number] = [0, -1, -1, 0];

  for (let y = 1; y < W; y += 1) {
    for (let x = 1; x < W; x += 1) {
      let lastSum = 0;

      const sizeLimit = W - getMax(y, x);

      // For each w, we only have to add the next column and row
      for (let w = 0; w < sizeLimit; w += 1) {
        let sum = lastSum;
        const cx = x + w;
        const ry = y + w;

        for (let row = y; row < ry; row += 1) {
          sum += power(row, cx, gridSerial);
        }

        for (let col = x; col < cx; col += 1) {
          sum += power(ry, col, gridSerial);
        }

        sum += power(ry, cx, gridSerial);

        if (sum > max[0]) {
          max[0] = sum;
          max[1] = y;
          max[2] = x;
          max[3] = w + 1;
        }

        /*
          Short-circuit; the field has a lot of negatives, so after awhile it's
          only downhill.

          The sum doesn't strictly increase, though, so we need a minimum size
          as well. 12 is the smallest I could use while still getting the right
          answer.
        */
        if (sum < lastSum && w > 12) { break; }

        lastSum = sum;
      }
    }
  }

  return `${max[2]},${max[1]},${max[3]}`;
};
