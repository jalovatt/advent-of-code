import { split } from '@lib/processing';

type Color = 'red' | 'green' | 'blue';
type Turn = Record<Color, number>;

const PART_1_MAX: Turn = {
  red: 12,
  green: 13,
  blue: 14,
};

type Game = {
  id: number;
  turns: Turn[];
};

const parseInput = (input: string): Game[] => split(input)
  .map((line) => {
    const [, id, rest] = line.match(/Game (\d+): (.+)$/)!;
    const turns = rest.split('; ').map((str) => {
      const t: Turn = { red: 0, green: 0, blue: 0 };
      str.match(/(\d+ (?:red|green|blue))/g)!.forEach((segment) => {
        const [, value, color] = segment.match(/(\d+) (.+)/)!;

        t[color as Color] = parseInt(value, 10);
      });

      return t;
    });

    return { id: parseInt(id, 10), turns };
  });

const turnIsPossible = (turn: Turn) => (
  turn.red <= PART_1_MAX.red
  && turn.green <= PART_1_MAX.green
  && turn.blue <= PART_1_MAX.blue
);

export const part1 = (input: string): number => {
  const games = parseInput(input);
  const possible = games.filter((game) => game.turns.every(turnIsPossible));

  return possible.reduce((acc, cur) => acc + cur.id, 0);
};

const gamePower = (game: Game) => {
  const max = {
    red: 0,
    green: 0,
    blue: 0,
  };

  game.turns.forEach((turn) => {
    max.red = (turn.red > max.red) ? turn.red : max.red;
    max.green = (turn.green > max.green) ? turn.green : max.green;
    max.blue = (turn.blue > max.blue) ? turn.blue : max.blue;
  });

  return max.red * max.green * max.blue;
};

export const part2 = (input: string): number => {
  const games = parseInput(input);

  return games.reduce((acc, cur) => acc + gamePower(cur), 0);
};
