import { log } from '@lib/logging';

const WIDTH = 5;

type BingoCell = { value: string, marked: boolean };
type BingoField = (BingoCell)[][];

class Bingo {
  field: BingoField;
  lookup: { [key: string]: number[] };
  hasWon: boolean;

  constructor(field: BingoField) {
    this.field = field;
    this.lookup = {};
    this.hasWon = false;

    for (let row = 0; row < WIDTH; row += 1) {
      for (let col = 0; col < WIDTH; col += 1) {
        const { value } = field[row][col];
        this.lookup[value] = [row, col];
      }
    }
  }

  update(value: string): boolean {
    if (this.lookup[value]) {
      const [row, col] = this.lookup[value];
      this.field[row][col].marked = true;

      this.hasWon = this.check(row, col);
      return this.hasWon;
    }

    return false;
  }

  check(row: number, col: number): boolean {
    let horizontalWinner = true;
    for (let i = 0; i < WIDTH; i += 1) {
      if (!this.field[row][i].marked) {
        horizontalWinner = false;
        break;
      }
    }

    if (horizontalWinner) { return true; }

    let verticalWinner = true;
    for (let i = 0; i < WIDTH; i += 1) {
      if (!this.field[i][col].marked) {
        verticalWinner = false;
        break;
      }
    }

    if (verticalWinner) { return true; }

    return false;
  }

  score() {
    let score = 0;

    for (let row = 0; row < WIDTH; row += 1) {
      for (let col = 0; col < WIDTH; col += 1) {
        const cell = this.field[row][col];

        if (!cell.marked) {
          score += parseInt(cell.value, 10);
        }
      }
    }

    return score;
  }

  print() {
    const pretty = this.field.map((row) => (
      row.map((cell) => {
        if (cell.marked) { return `[${cell.value.padStart(2, ' ')}]`; }

        return ` ${cell.value.padStart(2, ' ')} `;
      }).join(' ')
    )).join('\n');

    log(pretty);
  }
}

const parseInput = (input: string): [string[], Bingo[]] => {
  const [rawNumbers, ...rawCards] = input.trim().split('\n\n');

  const numbers = rawNumbers.split(',');
  const cards = rawCards.map((raw) => {
    const field = raw.split('\n').map((row) => row.trim().split(/\s+/).map((value) => ({ value, marked: false })));
    return new Bingo(field as BingoField);
  });

  return [numbers, cards];
};

const play = (numbers: string[], cards: Bingo[], wantLast = false): [string, Bingo] => {
  let cardsLeft = cards.length;

  for (const n of numbers) {
    for (const card of cards) {
      if (!card.hasWon && card.update(n)) {
        if (!wantLast || (wantLast && cardsLeft === 1)) {
          // card.print();

          return [n, card];
        }

        cardsLeft -= 1;
      }
    }
  }

  throw new Error(wantLast ? 'Last card never wins' : 'No winner');
};

export const a = (input: string): number => {
  const [numbers, cards] = parseInput(input);
  const [winningNumber, winningCard] = play(numbers, cards);

  return winningCard.score() * parseInt(winningNumber, 10);
};

export const b = (input: string): number => {
  const [numbers, cards] = parseInput(input);
  const [winningNumber, winningCard] = play(numbers, cards, true);

  return winningCard.score() * parseInt(winningNumber, 10);
};
