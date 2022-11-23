import { log } from '@lib/logging';
import { IntCode, RunState } from '../IntCode';

enum Dir {
  Up,
  Right,
  Down,
  Left,
}

enum Color {
  Black,
  White,
}

enum Turn {
  Left,
  Right,
}

const getNextDir = (d: Dir, t: Turn): Dir => (
  (d + (t || -1) + 4) % 4
);

type Hull = Map<number, Map<number, Color>>;

// [X, Y]
type Point = [number, number];

const moves: Record<Dir, Point> = {
  [Dir.Up]: [0, -1],
  [Dir.Right]: [1, 0],
  [Dir.Down]: [0, 1],
  [Dir.Left]: [-1, 0],
};

class Robot {
  pos: Point;
  dir: Dir;
  ic: IntCode;
  hull: Hull;

  constructor(input: string, startingPanel: Color) {
    this.pos = [0, 0];
    this.dir = Dir.Up;
    this.hull = new Map([[0, new Map([[0, Color.Black]])]]);
    this.ic = new IntCode(input, { input: [startingPanel] });
  }

  get(p: Point): number {
    return this.hull.get(p[1])?.get(p[0]) ?? Color.Black;
  }

  set(p: Point, c: Color) {
    if (!this.hull.has(p[1])) {
      this.hull.set(p[1], new Map());
    }

    this.hull.get(p[1])!.set(p[0], c);
  }

  step() {
    if (!this.ic.input.length) {
      this.ic.input.push(this.get(this.pos));
    }
    this.ic.run();

    if (this.ic.runState !== RunState.Halted) {
      const c = this.ic.output.shift()!;
      const t = this.ic.output.shift()!;

      this.set(this.pos, c as Color);
      this.dir = getNextDir(this.dir, t as Turn);
      const move = moves[this.dir];

      this.pos[0] += move[0];
      this.pos[1] += move[1];
    }
  }

  run() {
    while (this.ic.runState !== RunState.Halted) {
      this.step();
    }
  }

  countPainted() {
    let count = 0;
    for (const row of this.hull.values()) {
      count += row.size;
    }

    return count;
  }

  print() {
    let yMin = this.pos[1];
    let yMax = this.pos[1];
    let xMin = this.pos[0];
    let xMax = this.pos[0];

    const rows = Array.from(this.hull.entries());

    rows.forEach(([y, row]) => {
      yMin = y < yMin ? y : yMin;
      yMax = y > yMax ? y : yMax;

      const arr = Array.from(row.keys());
      arr.forEach((x) => {
        xMin = x < xMin ? x : xMin;
        xMax = x > xMax ? x : xMax;
      });
    });

    xMax += 1;
    yMax += 1;

    const field = new Array(yMax - yMin).fill(null)
      .map(() => new Array(xMax - xMin).fill(Color.Black));

    for (let y = 0; y < field.length; y += 1) {
      for (let x = 0; x < field[0].length; x += 1) {
        field[y][x] = this.hull.get(y + yMin)?.get(x + xMin) ?? Color.Black;
      }
    }

    log();
    log(field.map((row, y) => row.map((c, x) => {
      if (y + yMin === this.pos[1] && x + xMin === this.pos[0]) {
        return (this.dir === Dir.Up && '^')
          || (this.dir === Dir.Right && '>')
          || (this.dir === Dir.Left && '<')
          || (this.dir === Dir.Down && 'v');
      }
      return (c === Color.White) ? '#' : '.';
    }).join('')).join('\n'));
  }
}

export const part1 = (input: string): number => {
  const robot = new Robot(input, 0);

  robot.run();

  return robot.countPainted();
};

export const part2 = (input: string): void => {
  const robot = new Robot(input, 1);

  robot.run();

  robot.print();
};
