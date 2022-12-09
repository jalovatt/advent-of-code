import { split } from '@lib/processing';

type Dir = 'U' | 'D' | 'L' | 'R';
type Pos = { x: number, y: number };

const moves: Record<Dir, Pos> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

class Node {
  pos: Pos;

  constructor() {
    this.pos = { x: 0, y: 0 };
  }
}

class Head extends Node {
  // The child will always be there, it just doesn't exist when the head
  // is created.
  child!: Knot;

  run(input: string) {
    split(input).forEach((line) => {
      this.move(line);
    });
  }

  move(line: string) {
    const args = line.split(' ') as [Dir, string];
    const d = args[0];
    const n = parseInt(args[1], 10);

    const move = moves[d];

    for (let i = 0; i < n; i += 1) {
      this.pos.x += move.x;
      this.pos.y += move.y;

      this.child.follow();
    }
  }
}

class Knot extends Node {
  parent: Head | Knot;
  child?: Knot;

  constructor(following: Head | Knot) {
    super();

    this.parent = following;
    following.child = this;
  }

  follow() {
    const dx = this.parent!.pos.x - this.pos.x;
    const dy = this.parent!.pos.y - this.pos.y;

    let mx = 0;
    let my = 0;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      mx = Math.sign(dx);
      my = Math.sign(dy);
    }

    this.pos.x += mx;
    this.pos.y += my;

    if (this.child) {
      this.child.follow();
    }
  }
}

class Tail extends Knot {
  visited: Set<string>;

  constructor(following: Head | Knot) {
    super(following);

    this.visited = new Set(['0,0']);
  }

  follow() {
    super.follow();

    this.visited.add(`${this.pos.x},${this.pos.y}`);
  }
}

export const part1 = (input: string): number => {
  const head = new Head();
  const tail = new Tail(head);

  head.run(input);

  return tail.visited.size;
};

export const part2 = (input: string): number => {
  const head = new Head();

  let prev: Head | Knot = head;
  for (let i = 0; i < 8; i += 1) {
    prev = new Knot(prev);
  }

  const tail = new Tail(prev);

  head.run(input);
  return tail.visited.size;
};
