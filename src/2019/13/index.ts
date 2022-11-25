import { log } from '@lib/logging';
import { IntCode } from '../IntCode';

enum Tile {
  Empty,
  Wall,
  Block,
  Paddle,
  Ball,
}

const tileChars: Record<Tile, string> = {
  [Tile.Empty]: ' ',
  [Tile.Wall]: '#',
  [Tile.Block]: '+',
  [Tile.Paddle]: '_',
  [Tile.Ball]: 'o',
};

class Game {
  ic: IntCode;
  screen: Tile[][];
  playing: boolean;
  score: number;

  constructor(input: string, playing = false) {
    this.ic = new IntCode(input, {
      replaceInitialState: playing ? [[0, 2]] : undefined,
    });
    this.screen = new Array(21).fill(null).map(() => new Array(44).fill(Tile.Empty));
    this.playing = playing;
    this.score = 0;
  }

  updateScreen() {
    for (let i = 0; i < this.ic.output.length; i += 3) {
      const x = this.ic.output[i];
      const y = this.ic.output[i + 1];
      const t = this.ic.output[i + 2] as Tile | number;

      if (x === -1 && y === 0) {
        this.score = t as number;
      } else {
        this.screen[y][x] = t as Tile;
      }
    }

    this.ic.output = [];
  }

  step() {
    this.ic.run();
    this.updateScreen();
  }

  play() {
    do {
      this.step();

      const px = this.screen[19].findIndex((t) => t === Tile.Paddle);
      const by = this.screen.findIndex((row) => row.includes(Tile.Ball));
      const bx = this.screen[by].findIndex((t) => t === Tile.Ball);

      const dir = (bx > px && 1)
        || (bx < px && -1)
        || 0;

      this.ic.input.push(dir);
    } while (this.countBlocks());

    return this.score;
  }

  print() {
    log(this.screen.map((row) => row.map((t) => tileChars[t]).join('')).join('\n'));
  }

  countBlocks() {
    return this.screen.reduce((acc, row) => (
      acc + row.reduce((acc2, t) => acc2 + (t === Tile.Block ? 1 : 0), 0)
    ), 0);
  }
}

export const part1 = (input: string): number => {
  const game = new Game(input);

  game.step();

  return game.countBlocks();
};

export const part2 = (input: string): number => {
  const game = new Game(input, true);

  return game.play();
};
