import CircuitBreaker from '@lib/CircuitBreaker';

type Vec2 = [number, number];
enum Facing { N, E, S, W }

const initialCarts: Record<string, [Facing, string]> = {
  '^': [Facing.N, '|'],
  v: [Facing.S, '|'],
  '>': [Facing.E, '-'],
  '<': [Facing.W, '-'],
};

const facingMovements: Record<Facing, Vec2> = {
  [Facing.N]: [-1, 0],
  [Facing.S]: [1, 0],
  [Facing.E]: [0, 1],
  [Facing.W]: [0, -1],
};

const corners: Record<string, Record<Facing, Facing>> = {
  '/': {
    [Facing.N]: Facing.E,
    [Facing.S]: Facing.W,
    [Facing.E]: Facing.N,
    [Facing.W]: Facing.S,
  },
  '\\': {
    [Facing.N]: Facing.W,
    [Facing.S]: Facing.E,
    [Facing.E]: Facing.S,
    [Facing.W]: Facing.N,
  },
};

enum TurnChoice { Left, Straight, Right, length }
const turns: Record<Facing, Partial<Record<TurnChoice, Facing>>> = {
  [Facing.N]: {
    [TurnChoice.Left]: Facing.W,
    [TurnChoice.Right]: Facing.E,
  },
  [Facing.S]: {
    [TurnChoice.Left]: Facing.E,
    [TurnChoice.Right]: Facing.W,
  },
  [Facing.E]: {
    [TurnChoice.Left]: Facing.N,
    [TurnChoice.Right]: Facing.S,
  },
  [Facing.W]: {
    [TurnChoice.Left]: Facing.S,
    [TurnChoice.Right]: Facing.N,
  },
};

type Cart = { pos: Vec2, facing: Facing, nextTurnChoice: TurnChoice, alive: boolean };

type Track = { map: string[][], size: Vec2 };

const run = (input: string, getFirstCollision = true): string => {
  const carts: Cart[] = [];
  const track: Track = { map: [], size: [0, 0] };

  input.split('\n').forEach((row, y) => {
    track.map.push([]);

    row.split('').forEach((c, x) => {
      if (c in initialCarts) {
        const [facing, replacementChar] = initialCarts[c];
        carts.push({ pos: [y, x], facing, nextTurnChoice: TurnChoice.Left, alive: true });

        track.map[y][x] = replacementChar;
      } else {
        track.map[y][x] = c;
      }

      if (x > track.size[1]) { track.size[1] = x; }
    });
  });

  const countLiveCarts = () => {
    let count = 0;

    for (let i = 0; i < carts.length; i += 1) {
      if (carts[i].alive) { count += 1; }
    }

    return count;
  };

  track.size[0] = track.map.length;
  track.size[1] += 1;

  const breaker = new CircuitBreaker(100000);

  while (countLiveCarts() > 1) {
    breaker.tick();

    carts.sort((a, b) => (a.pos[0] - b.pos[0]) || (a.pos[1] - b.pos[1]));

    for (let i = 0; i < carts.length; i += 1) {
      if (!carts[i].alive) { continue; }

      const cart = carts[i];
      const move = facingMovements[cart.facing];

      cart.pos[0] += move[0];
      cart.pos[1] += move[1];

      const char = track.map[cart.pos[0]][cart.pos[1]];

      if (char in corners) {
        cart.facing = corners[char][cart.facing];
      } else if (char === '+') {
        cart.facing = turns[cart.facing][cart.nextTurnChoice] ?? cart.facing;
        cart.nextTurnChoice += 1;
        if (cart.nextTurnChoice === TurnChoice.length) {
          cart.nextTurnChoice = 0;
        }
      }

      for (let j = 0; j < carts.length; j += 1) {
        if (j === i || !carts[j].alive) { continue; }

        const other = carts[j].pos;
        if (other[0] === cart.pos[0] && other[1] === cart.pos[1]) {
          if (getFirstCollision) {
            return `${cart.pos[1]},${cart.pos[0]}`;
          }

          cart.alive = false;
          carts[j].alive = false;
        }
      }
    }
  }

  const cart = carts.find((c) => c.alive)!;
  return `${cart.pos[1]},${cart.pos[0]}`;
};

export const part1 = run;
export const part2 = (input: string) => run(input, false);
