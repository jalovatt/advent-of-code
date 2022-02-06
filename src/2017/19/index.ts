import CircuitBreaker from '@lib/CircuitBreaker';

const NS = '|';
const EW = '-';
const TURN = '+';
const EMPTY = ' ';
type Field = (string | typeof NS | typeof EW | typeof TURN | typeof EMPTY)[][];

const parseInput = (input: string): Field => {
  const field: Field = input.split('\n').map((row) => row.split(''));

  return field;
};

// y, x
type Pos = [number, number];

const N = 'N';
const S = 'S';
const E = 'E';
const W = 'W';
type Direction = typeof N | typeof S | typeof E | typeof W;

const move: Record<Direction, Pos> = {
  N: [-1, 0],
  S: [1, 0],
  E: [0, 1],
  W: [0, -1],
};

const turnDirections: Record<Direction, Direction[]> = {
  N: [E, W],
  S: [E, W],
  E: [N, S],
  W: [N, S],
};

const solve = (input: string, wantCount = false): string | number => {
  const field = parseInput(input);
  const pos: Pos = [0, field[0].indexOf('|')];
  let direction: Direction = 'S';

  let count = 0;
  const seen: string[] = [];

  const breaker = new CircuitBreaker(100000);
  while (!breaker.hasTripped) {
    breaker.tick();
    count += 1;

    const ny: number = pos[0] + move[direction][0];
    const nx: number = pos[1] + move[direction][1];
    const n = field[ny]?.[nx];

    if (!n || n === EMPTY) { break; }

    pos[0] = ny;
    pos[1] = nx;

    if (n === '+') {
      const options = turnDirections[direction] as Direction[];

      const m = move[options[0]];

      const yAfter: number = ny + m[0];
      const xAfter: number = nx + m[1];
      const after = field[yAfter]?.[xAfter];

      direction = (typeof after !== 'undefined' && after !== EMPTY)
        ? options[0]
        : options[1];
    } else if (n !== NS && n !== EW) {
      seen.push(n);
    }
  }

  return wantCount ? count : seen.join('');
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, true) as number;
