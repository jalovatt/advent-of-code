import CircuitBreaker from '@lib/CircuitBreaker';

// [n, y, x]
type Direction = 'N' | 'S' | 'W' | 'E';
type State = { n: number, y: number, x: number, dir: Direction, left: number, w: number };

const turn: Record<Direction, Direction> = {
  N: 'W',
  W: 'S',
  S: 'E',
  E: 'N',
};

const move: Record<Direction, [number, number]> = {
  N: [-1, 0],
  S: [1, 0],
  E: [0, 1],
  W: [0, -1],
};

export const part1 = (input: string): number => {
  const n = parseInt(input, 10);

  const state: State = { n: 1, y: 0, x: 0, dir: 'E', left: 1, w: 1 };

  const breaker = new CircuitBreaker(n);
  while (state.n !== n) {
    breaker.tick();

    const m = move[state.dir];
    state.y += m[0];
    state.x += m[1];

    state.left -= 1;
    if (!state.left) {
      state.dir = turn[state.dir];
      if (state.dir === 'E' || state.dir === 'W') {
        state.w += 1;
      }
      state.left = state.w;
    }

    state.n += 1;
  }

  return Math.abs(state.x) + Math.abs(state.y);
};

const NEIGHBOURS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const part2 = (input: string): number => {
  const n = parseInt(input, 10);

  const state: State = { n: 1, y: 0, x: 0, dir: 'E', left: 1, w: 1 };
  const values: number[][] = [[1]];

  const breaker = new CircuitBreaker(100);
  while (state.n <= n) {
    breaker.tick();

    const m = move[state.dir];
    state.y += m[0];
    state.x += m[1];

    state.left -= 1;
    if (!state.left) {
      state.dir = turn[state.dir];
      if (state.dir === 'E' || state.dir === 'W') {
        state.w += 1;
      }
      state.left = state.w;
    }

    let sum = 0;

    for (let i = 0; i < NEIGHBOURS.length; i += 1) {
      const ny = state.y + NEIGHBOURS[i][0];
      const nx = state.x + NEIGHBOURS[i][1];

      sum += values[ny]?.[nx] || 0;
    }

    if (!values[state.y]) { values[state.y] = []; }
    values[state.y][state.x] = sum;
    state.n = sum;
  }

  return state.n;
};
