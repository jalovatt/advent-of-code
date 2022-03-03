import { split } from '@lib/processing';

enum State { Open = '.', Tree = '|', Yard = '#' }
type Field = State[][];
// y, x
type Pos = [number, number];

const parseInput = (input: string): Field => split(input).map((row) => split(row, '') as State[]);

const neighbours: Pos[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const updateCell: Record<State, (y: number, x: number, f: Field) => State> = {
  [State.Open]: (y, x, f) => {
    let trees = 0;

    for (let i = 0; i < neighbours.length; i += 1) {
      const ny = y + neighbours[i][0];
      const nx = x + neighbours[i][1];

      if (ny < 0 || nx < 0 || ny === f.length || nx === f[0].length) {
        continue;
      }

      if (f[ny][nx] === State.Tree) {
        trees += 1;

        if (trees >= 3) { return State.Tree; }
      }
    }

    return State.Open;
  },
  [State.Tree]: (y, x, f) => {
    let yards = 0;

    for (let i = 0; i < neighbours.length; i += 1) {
      const ny = y + neighbours[i][0];
      const nx = x + neighbours[i][1];

      if (ny < 0 || nx < 0 || ny === f.length || nx === f[0].length) {
        continue;
      }

      if (f[ny][nx] === State.Yard) {
        yards += 1;

        if (yards >= 3) { return State.Yard; }
      }
    }

    return State.Tree;
  },
  [State.Yard]: (y, x, f) => {
    let yard = 0;
    let tree = 0;

    for (let i = 0; i < neighbours.length; i += 1) {
      const ny = y + neighbours[i][0];
      const nx = x + neighbours[i][1];

      if (ny < 0 || nx < 0 || ny === f.length || nx === f[0].length) {
        continue;
      }

      const n = f[ny][nx];
      if (n === State.Yard) {
        yard = 1;
      } else if (n === State.Tree) {
        tree = 1;
      }

      if (yard && tree) {
        return State.Yard;
      }
    }

    return State.Open;
  },
};

const run = (input: string, times: number): number => {
  const base = parseInput(input);
  const fields: Field[] = [
    base,
    new Array(base.length).fill(null).map(() => new Array(base[0].length)),
  ];

  let current = 1;

  const seenAt: Map<string, number> = new Map();
  const scoresByTime: Map<number, number> = new Map();

  for (let i = 0; i < times; i += 1) {
    const prev = 1 - current;

    const states: State[] = [];

    const counts = {
      [State.Open]: 0,
      [State.Tree]: 0,
      [State.Yard]: 0,
    };

    for (let y = 0; y < base.length; y += 1) {
      for (let x = 0; x < base[0].length; x += 1) {
        const was = fields[prev][y][x];
        const next = updateCell[was](y, x, fields[prev]);
        fields[current][y][x] = next;

        states.push(next);
        counts[next] += 1;
      }
    }

    const hash = states.join('');
    const score = counts[State.Tree] * counts[State.Yard];

    if (seenAt.has(hash)) {
      const remaining = (times - i - 1) % (i - seenAt.get(hash)!);
      const index = seenAt.get(hash)! + remaining;

      return scoresByTime.get(index)!;
    }

    seenAt.set(hash, i);
    scoresByTime.set(i, score);

    current = prev;
  }

  return scoresByTime.get(times - 1)!;
};

export const part1 = (input: string): number => run(input, 10);
export const part2 = (input: string): number => run(input, 1000000000);
