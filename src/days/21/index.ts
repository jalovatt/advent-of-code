import { split } from '../../utilities/processing';

const ring = (n: number, l: number) => ((n - 1) % l) + 1;

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

export const b = (input: string) => {};
