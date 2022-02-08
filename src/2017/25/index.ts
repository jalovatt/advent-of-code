import { split } from '@lib/processing';

const ONE = '1';
const ZERO = '0';
type Binary = typeof ONE | typeof ZERO;

const LEFT = 'left';
const RIGHT = 'right';
type Move = typeof LEFT | typeof RIGHT;

class Tape {
  cursor: number;
  minVisited: number;
  maxVisited: number;
  values: Record<number, Binary>;

  constructor() {
    this.cursor = 0;
    this.minVisited = 0;
    this.maxVisited = 0;
    this.values = {};
  }

  set(v: Binary) {
    this.values[this.cursor] = v;
  }

  get(): Binary {
    if (this.values[this.cursor] === undefined) {
      this.values[this.cursor] = ZERO;
    }

    return this.values[this.cursor];
  }

  move(m: Move) {
    this.cursor += (m === LEFT ? -1 : 1);

    if (m === LEFT && this.cursor < this.minVisited) {
      this.minVisited = this.cursor;
    } else if (m === RIGHT && this.cursor > this.maxVisited) {
      this.maxVisited = this.cursor;
    }
  }

  checksum(): number {
    let count = 0;

    for (let i = this.minVisited; i <= this.maxVisited; i += 1) {
      if (this.values[i] === ONE) {
        count += 1;
      }
    }

    return count;
  }
}

type Operation = { write: Binary, move: Move, next: string };
type State = {
  [ZERO]: Operation,
  [ONE]: Operation,
};
type States = Record<string, State>;

type Instructions = { states: States, start: string, stopAfter: number };

const parseInstructions = (input: string): Instructions => {
  const states: States = {};

  const [header, ...stateChunks] = split(input, '\n\n');
  const start = header.match(/in state (.+)./)![1];
  const stopAfter = parseInt(header.match(/after (\d+) steps/)![1], 10);

  stateChunks.forEach((s) => {
    const [stateKey, ...branches] = s.split('\n');
    const k = stateKey.match(/ (.):$/)![1];

    states[k] = {
      [ZERO]: {
        write: branches[1].match(/value (.+)./)![1] as Binary,
        move: branches[2].match(/to the (.+)./)![1] as Move,
        next: branches[3].match(/state (.+)./)![1],
      },
      [ONE]: {
        write: branches[5].match(/value (.+)./)![1] as Binary,
        move: branches[6].match(/to the (.+)./)![1] as Move,
        next: branches[7].match(/state (.+)./)![1],
      },
    };
  });

  return { states, start, stopAfter };
};

class StateMachine {
  states: States;
  current: string;
  tape: Tape;
  stepsRun: number;
  stopAfter: number;

  constructor(instructions: string) {
    const parsedInstructions = parseInstructions(instructions);
    this.states = parsedInstructions.states;
    this.current = parsedInstructions.start;
    this.stopAfter = parsedInstructions.stopAfter;
    this.stepsRun = 0;
    this.tape = new Tape();
  }

  step() {
    const op = this.states[this.current]?.[this.tape.get()];

    this.tape.set(op.write);
    this.tape.move(op.move);
    this.current = op.next;

    this.stepsRun += 1;
  }

  runUntilChecksum(): number {
    while (this.stepsRun < this.stopAfter) {
      this.step();
    }

    return this.tape.checksum();
  }
}

export const part1 = (input: string): number => {
  const sm = new StateMachine(input);

  return sm.runUntilChecksum();
};
