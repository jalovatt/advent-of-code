type Array2<T> = T[][];

export const part1 = (input: string, width: number, height: number): number => {
  const layerCounts: Record<string, number>[] = [];

  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < input.length; i += 1) {
    if (!layerCounts[z]) {
      layerCounts[z] = {};
    }

    const c = input[i];
    layerCounts[z][c] = (layerCounts[z][c] || 0) + 1;

    x += 1;

    if (x % width === 0) {
      x = 0;
      y += 1;

      if (y % height === 0) {
        y = 0;
        z += 1;
      }
    }
  }

  const minLayer = layerCounts.reduce((acc, cur) => (cur[0] < acc[0]
    ? cur
    : acc
  ));

  return minLayer[1] * minLayer[2];
};

export const part2 = (input: string, width: number, height: number): string => {
  const layerSize = width * height;
  const nLayers = input.length / layerSize;

  const visibleImage: Array2<string> = [];

  let x = 0;
  let y = 0;

  for (let i = 0; i < layerSize; i += 1) {
    for (let z = 0; z < nLayers; z += 1) {
      const c = input[z * layerSize + i];

      if (c !== '2') {
        if (!visibleImage[y]) {
          visibleImage[y] = [];
        }

        visibleImage[y][x] = c;
        break;
      }
    }

    x += 1;

    if (x % width === 0) {
      x = 0;
      y += 1;
    }
  }

  const out = visibleImage.map((row) => row.join('')).join('\n');
  return out.replace(/0/g, '█').replace(/1/g, '.');
};
