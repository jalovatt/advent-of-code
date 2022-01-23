import { split } from '@lib/processing';

export const ring = (n: number, l: number) => ((n - 1) % l) + 1;

class DeterministicDie {
  rollCount: number;
  sides: number;
  current = 0;

  constructor(sides: number) {
    this.rollCount = 0;
    this.sides = sides;
  }

  roll(): number {
    this.current = ring(this.current + 1, this.sides);
    this.rollCount += 1;
    return this.current;
  }
}

const sumThreeRolls = (die: DeterministicDie) => die.roll() + die.roll() + die.roll();

export const a = (input: string) => {
  const rawPlayers = split(input).map((line) => parseInt(line.match(/(\d+)$/)![1], 10));

  const BOARD = 10;

  const players = [
    { pos: rawPlayers[0], score: 0 },
    { pos: rawPlayers[1], score: 0 },
  ];

  let currentPlayer = 0;
  const die = new DeterministicDie(100);

  do {
    const cur = players[currentPlayer];
    cur.pos = ring(cur.pos + sumThreeRolls(die), BOARD);
    cur.score += cur.pos;

    currentPlayer = (currentPlayer) ? 0 : 1;
  } while (players[0].score < 1000 && players[1].score < 1000);

  return players[currentPlayer].score * die.rollCount;
};

const ROLL_OUTCOMES = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];

export const encodeState = (p1s: number, p2s: number, p1p: number, p2p: number, turn: number) => (
  (((((((p1s << 5) + p2s) << 4) + p1p) << 4) + p2p) << 1) + turn
);

export const decodeState = (state: number) => ({
  turn: state & 1,
  p2p: (state >>> 1) & 0b1111,
  p1p: (state >>> 5) & 0b1111,
  p2s: (state >>> 9) & 0b11111,
  p1s: (state >>> 14) & 0b11111,
});

/*
  Storing game state:
    P1 score: 0-20  5 bits
    P2 score: 0-20  5 bits
    P1 pos: 1-10    4 bits
    P2 pos: 1-10    4 bits
    Turn:           1 bit
                    ------
                    19 bits

  p1s    p2s    p1p  p2p   t
  10101  10101  100  1000  0
     21     21    4     8  0 (p1 turn)

  101011010110010000
*/

type StateTree = Record<number, [number, number][]>;

const P1_WIN = -1;
const P2_WIN = -2;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const describeState = (state: number) => {
  if (state === P1_WIN) { return 'P1 Win'; }
  if (state === P2_WIN) { return 'P2 Win'; }
  return decodeState(state);
};

const prepareStateTree = (initialState: number, winningScore = 21): StateTree => {
  const stateTree: StateTree = {};
  const toVisit = [initialState];

  while (toVisit.length) {
    const cur = toVisit.pop()!;
    if (stateTree[cur]) { continue; }

    const state = decodeState(cur);

    stateTree[cur] = [];

    for (let i = 0; i < ROLL_OUTCOMES.length; i += 1) {
      const v = ROLL_OUTCOMES[i][0];
      const count = ROLL_OUTCOMES[i][1];

      let p1p = state.p1p;
      let p2p = state.p2p;
      let p1s = state.p1s;
      let p2s = state.p2s;

      let nextState;

      if (!state.turn) {
        p1p = ring(p1p + v, 10);
        p1s += p1p;

        if (p1s >= winningScore) {
          nextState = P1_WIN;
        }
      } else {
        p2p = ring(p2p + v, 10);
        p2s += p2p;

        if (p2s >= winningScore) {
          nextState = P2_WIN;
        }
      }

      nextState ??= encodeState(p1s, p2s, p1p, p2p, (state.turn + 1) & 1);

      if (!stateTree[nextState] && nextState !== P1_WIN && nextState !== P2_WIN) {
        toVisit.push(nextState);
      }

      stateTree[cur].push([nextState, count]);
    }
  }

  return stateTree;
};

// Count of the player that wins in the most paths
export const b = (input: string, winningScore?: number) => {
  const [p1, p2] = split(input).map((line) => parseInt(line.match(/(\d+)$/)![1], 10));

  const initialState = (((p1 << 4) + p2) << 1);
  const stateTree = prepareStateTree(initialState, winningScore);

  const solvedStates: Record<number, [number, number]> = {};

  const solveState = (state: number): [number, number] => {
    const nextStates = stateTree[state];

    const wins: [number, number] = [0, 0];

    for (let i = 0; i < nextStates.length; i += 1) {
      const next = nextStates[i][0];
      const count = nextStates[i][1];

      if (next === P1_WIN) {
        wins[0] += count;
      } else if (next === P2_WIN) {
        wins[1] += count;
      } else {
        if (!solvedStates[next]) {
          solvedStates[next] = solveState(next);
        }

        wins[0] += solvedStates[next][0] * count;
        wins[1] += solvedStates[next][1] * count;
      }
    }

    return wins;
  };

  solvedStates[initialState] = solveState(initialState);

  return Math.max(solvedStates[initialState][0], solvedStates[initialState][1]);
};
