import { split, splitToNumber } from '../../utilities/processing';

type Cell = { x: number, y: number, v: number };
type Field = number[][];

const neighbours = [
  [-1, 0],
  [+1, 0],
  [0, +1],
  [0, -1],
];

// Behaves like a map, but only includes values if the cell and return are defined
const mapNeighboursSparse = (
  field: Field,
  y: number,
  x: number,
  fn: (ny: number, nx: number, nv: number) => any,
) => {
  const out = [];

  for (let ni = 0; ni < neighbours.length; ni += 1) {
    const [ny, nx] = neighbours[ni];
    const nv = field[y + ny]?.[x + nx];

    if (nv !== undefined) {
      const ret = fn(y + ny, x + nx, nv);

      if (ret !== undefined) {
        out.push(ret);
      }
    }
  }

  return out;
};

const findLowPoints = (field: Field) => {
  const lowPoints = [];

  for (let y = 0; y < field.length; y += 1) {
    for (let x = 0; x < field[0].length; x += 1) {
      const v = field[y][x];

      const neighbourValues = mapNeighboursSparse(field, y, x, (ny, nx, nv) => nv <= v);
      const lower = !neighbourValues.includes(true);

      if (lower) {
        lowPoints.push({ v, x, y });
      }
    }
  }

  return lowPoints;
};

export const a = (input: string) => {
  const lines = split(input).map((line) => splitToNumber(line, ''));
  const lowPoints = findLowPoints(lines);

  return lowPoints.reduce((acc, cur) => acc + cur.v + 1, 0);
};

export const b = (input: string) => {
  const lines = split(input).map((line) => splitToNumber(line, ''));
  const lowPoints = findLowPoints(lines);

  const basins: Cell[][] = [];

  lowPoints.forEach((lowPoint) => {
    const visited = new Set();

    const basin = [];
    const toVisit = [lowPoint];

    while (toVisit.length) {
      const next = toVisit.pop() as Cell;

      mapNeighboursSparse(lines, next.y, next.x, (ny, nx, nv) => {
        const nk = `${ny}-${nx}`;

        if (!visited.has(nk) && nv > next.v && nv < 9) {
          toVisit.push({ x: nx, y: ny, v: nv });
          visited.add(nk);
        }
      });

      basin.push(next);
    }

    basins.push(basin);
  });

  const topThreeBasins = basins.map((basin) => basin.length)
    .sort((basinA, basinB) => basinB - basinA)
    .slice(0, 3);

  return topThreeBasins.reduce((acc, cur) => acc * cur);
};
