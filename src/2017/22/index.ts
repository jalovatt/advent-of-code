import { log } from '@lib/logging';
import { split } from '@lib/processing';

enum State { Clean, Infected, Weakened, Flagged }
enum TurnDecision { Left, Right, Reverse, Not }
type StateMap = { [key in State]?: [State, TurnDecision] };
type Field = Record<string, State>;

type Pos = [number, number];
enum Direction { N, S, E, W }
type Bot = { y: number, x: number, facing: Direction };

const turn: Record<Direction, Record<TurnDecision, Direction>> = {
  [Direction.N]: {
    [TurnDecision.Left]: Direction.W,
    [TurnDecision.Right]: Direction.E,
    [TurnDecision.Reverse]: Direction.S,
    [TurnDecision.Not]: Direction.N,
  },
  [Direction.S]: {
    [TurnDecision.Left]: Direction.E,
    [TurnDecision.Right]: Direction.W,
    [TurnDecision.Reverse]: Direction.N,
    [TurnDecision.Not]: Direction.S,
  },
  [Direction.E]: {
    [TurnDecision.Left]: Direction.N,
    [TurnDecision.Right]: Direction.S,
    [TurnDecision.Reverse]: Direction.W,
    [TurnDecision.Not]: Direction.E,
  },
  [Direction.W]: {
    [TurnDecision.Left]: Direction.S,
    [TurnDecision.Right]: Direction.N,
    [TurnDecision.Reverse]: Direction.E,
    [TurnDecision.Not]: Direction.W,
  },
};

const move: Record<Direction, Pos> = {
  [Direction.N]: [-1, 0],
  [Direction.S]: [1, 0],
  [Direction.E]: [0, 1],
  [Direction.W]: [0, -1],
};

const nextStates1: StateMap = {
  [State.Clean]: [State.Infected, TurnDecision.Left],
  [State.Infected]: [State.Clean, TurnDecision.Right],
};

const nextStates2: StateMap = {
  [State.Clean]: [State.Weakened, TurnDecision.Left],
  [State.Weakened]: [State.Infected, TurnDecision.Not],
  [State.Infected]: [State.Flagged, TurnDecision.Right],
  [State.Flagged]: [State.Clean, TurnDecision.Reverse],
};

const findGridBounds = (field: Field, bot: Bot): [Pos, Pos] => {
  const min: Pos = [bot.y, bot.x];
  const max: Pos = [bot.y, bot.x];

  const entries = Object.entries(field);
  entries.forEach(([k]) => {
    const [y, x] = k.split(',').map((n) => parseInt(n, 10));

    min[0] = (y < min[0]) ? y : min[0];
    max[0] = (y > max[0]) ? y : max[0];

    min[1] = (x < min[1]) ? x : min[1];
    max[1] = (x > max[1]) ? x : max[1];
  });

  return [min, max];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const print = (field: Field, bot: Bot) => {
  const [min, max] = findGridBounds(field, bot);

  const symbols = {
    [State.Clean]: '.',
    [State.Infected]: '#',
    [State.Weakened]: 'w',
    [State.Flagged]: 'f',
  };

  const out: string[][] = [];
  for (let y = min[0] - 1; y <= max[0] + 1; y += 1) {
    const row: string[] = [];

    for (let x = min[1] - 1; x <= max[1] + 1; x += 1) {
      const k = `${y},${x}`;

      let v = symbols[field[k] ?? State.Clean];
      if (y === bot.y && x === bot.x) {
        v = `\x1b[33m${v}\x1b[0m`;
      }

      row.push(v);
    }

    out.push(row);
  }

  log(out.map((row) => row.join('')).join('\n'));
};

export const solve = (input: string, turns: number, stateMap: StateMap): number => {
  const field: Field = {};
  const lines = split(input);

  lines.forEach((line, y) => line.split('').forEach((v, x) => {
    field[`${y},${x}`] = (v === '#') ? State.Infected : State.Clean;
  }));

  const start = Math.floor(lines.length / 2);
  const bot: Bot = { y: start, x: start, facing: Direction.N };

  let turnsInfected = 0;
  let t = 0;
  while (t < turns) {
    const k = `${bot.y},${bot.x}`;
    const state = field[k] ?? State.Clean;
    const next = stateMap[state]!;

    field[k] = next[0];
    if (next[0] === State.Infected) {
      turnsInfected += 1;
    }

    bot.facing = turn[bot.facing][next[1]];
    const m = move[bot.facing];

    bot.y += m[0];
    bot.x += m[1];

    t += 1;
  }

  return turnsInfected;
};

export const part1 = (input: string, turns: number) => solve(input, turns, nextStates1);
export const part2 = (input: string, turns: number) => solve(input, turns, nextStates2);
