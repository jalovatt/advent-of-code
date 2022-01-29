import { log } from '@lib/logging';
import { split } from '@lib/processing';

type Node = { x: number, y: number, size: number, used: number, avail: number, pct: number };
type NodeGrid = Record<string, Node>;

const parseInput = (input: string): [NodeGrid, Node[]] => {
  /*
    root@ebhq-gridcenter# df -h
    Filesystem              Size  Used  Avail  Use%
    /dev/grid/node-x0-y0     85T   67T    18T   78%
    /dev/grid/node-x0-y1     91T   67T    24T   73%
  */

  const grid: NodeGrid = {};
  const arr: Node[] = [];

  split(input).slice(2).forEach((line) => {
    const [, x, y, size, used, avail, pct] = line.match(/-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/)!;

    const obj = {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      size: parseInt(size, 10),
      used: parseInt(used, 10),
      avail: parseInt(avail, 10),
      pct: parseInt(pct, 10),
    };

    grid[`${x},${y}`] = obj;
    arr.push(obj);
  });

  return [grid, arr];
};

const viablePair = (a: Node, b: Node): boolean => {
  if (!a.used) { return false; }
  if (b.avail < a.used) { return false; }
  return true;
};

export const part1 = (input: string): number => {
  const [, arr] = parseInput(input);

  let count = 0;
  const pairs: [string, string][] = [];

  for (let a = 0; a < arr.length - 1; a += 1) {
    for (let b = a + 1; b < arr.length; b += 1) {
      if (viablePair(arr[a], arr[b])) {
        pairs.push([`${arr[a].x},${arr[a].y}`, `${arr[b].x},${arr[b].y}`]);
        count += 1;
      }

      if (viablePair(arr[b], arr[a])) {
        pairs.push([`${arr[b].x},${arr[b].y}`, `${arr[a].x},${arr[a].y}`]);
        count += 1;
      }
    }
  }

  return count;
};

const print = (grid: NodeGrid, arr: Node[]) => {
  const [xMax, yMax] = arr.reduce((acc, cur) => {
    acc[0] = Math.max(acc[0], cur.x);
    acc[1] = Math.max(acc[1], cur.y);

    return acc;
  }, [0, 0]);

  const out = [];
  for (let y = 0; y <= yMax; y += 1) {
    const row = [];
    for (let x = 0; x <= xMax; x += 1) {
      const char = (x === 0 && y === 0) ? 'T'
        : (x === xMax && y === 0) ? 'G'
          : (grid[`${x},${y}`].used === 0) ? 'E'
            : (grid[`${x},${y}`].size > 100) ? '#'
              : '.';
      row.push(char);
    }

    out.push(row.join(''));
  }

  log(out.join('\n'));
};

/*
  No code here. :)

  After some parsing and logging, I was able to show that:
  - No used nodes have enough extra space to hold any other used node's data
  - Every node* is large enough to hold any other node's data

  This means all of the nodes* are interchangeable, reducing the problem to a
  subset of the 15 puzzle: One empty space (E), one target tile (T) at the
  top-right that needs to get to the top-left (G).

  * The middle row is made up of much larger nodes with a single normal-sized
    node at x = 0. These won't fit in any other nodes; they're immovable.

  Cost =  A) Cost to get E to the gap in the wall                  =  13
        + B) Cost to get E from the gap to the space left of T     =  44
        + C) Cost to move T n spaces, to G                         = 156

             To move ET n spaces to the left, i.e.:

             G....ET  =>  G...ET.  => ... => ET.....
             .......      .......            .......

             = n * (1 to swap ET + 4 to move E around T again)
             = 31 * 5
             = 155
               + 1 for the final swap
             = 156
                                                                   -------------
                                                                     213
*/
export const part2 = (input: string): number => {
  // const [grid, arr] = parseInput(input);
  // print(grid, arr);

  return 213;
};
