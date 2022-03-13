import { split } from '@lib/processing';

type OperationName = 'addr' | 'addi' | 'mulr' | 'muli' | 'banr' | 'bani' | 'borr' | 'bori' | 'setr' | 'seti' | 'gtir' | 'gtri' | 'gtrr' | 'eqir' | 'eqri' | 'eqrr';
type Operation = (inst: Instruction, state: State) => void;

type State = [number, number, number, number, number, number];
type Instruction = [OperationName, number, number, number];

export const operations: Record<OperationName, Operation> = {
  addr: (inst, state) => { state[inst[3]] = (state[inst[1]] + state[inst[2]]); },
  addi: (inst, state) => { state[inst[3]] = (state[inst[1]] + inst[2]); },
  mulr: (inst, state) => { state[inst[3]] = (state[inst[1]] * state[inst[2]]); },
  muli: (inst, state) => { state[inst[3]] = (state[inst[1]] * inst[2]); },
  banr: (inst, state) => { state[inst[3]] = (state[inst[1]] & state[inst[2]]); },
  bani: (inst, state) => { state[inst[3]] = (state[inst[1]] & inst[2]); },
  borr: (inst, state) => { state[inst[3]] = (state[inst[1]] | state[inst[2]]); },
  bori: (inst, state) => { state[inst[3]] = (state[inst[1]] | inst[2]); },
  setr: (inst, state) => { state[inst[3]] = (state[inst[1]]); },
  seti: (inst, state) => { state[inst[3]] = (inst[1]); },
  gtir: (inst, state) => { state[inst[3]] = ((inst[1] > state[inst[2]] ? 1 : 0)); },
  gtri: (inst, state) => { state[inst[3]] = ((state[inst[1]] > inst[2] ? 1 : 0)); },
  gtrr: (inst, state) => { state[inst[3]] = ((state[inst[1]] > state[inst[2]] ? 1 : 0)); },
  eqir: (inst, state) => { state[inst[3]] = ((inst[1] === state[inst[2]] ? 1 : 0)); },
  eqri: (inst, state) => { state[inst[3]] = ((state[inst[1]] === inst[2] ? 1 : 0)); },
  eqrr: (inst, state) => { state[inst[3]] = ((state[inst[1]] === state[inst[2]] ? 1 : 0)); },
};

const parseInput = (input: string): [Instruction[], number] => {
  const [ipLine, ...lines] = split(input);

  const ipRegister = parseInt(ipLine.match(/(\d+)/)![1], 10);
  const instructions: Instruction[] = lines.map((line) => {
    const [op, a, b, c] = split(line, ' ');

    return [op as OperationName, parseInt(a, 10), parseInt(b, 10), parseInt(c, 10)];
  });

  return [instructions, ipRegister];
};

class Runner {
  instructions: Instruction[];
  ipRegister: number;
  ticks: number;
  state: State;

  constructor(instructions: Instruction[], ipRegister: number) {
    this.instructions = instructions;
    this.ipRegister = ipRegister;

    this.ticks = 0;
    this.state = [0, 0, 0, 0, 0, 0];
  }

  run(wantLast = false): number {
    let last = 0;
    const seen: Set<number> = new Set();
    const seenStates: Set<string> = new Set();

    while (
      this.state[this.ipRegister] >= 0
      && this.state[this.ipRegister] < this.instructions.length
    ) {
      const at = this.state[this.ipRegister];

      const cur = this.instructions[this.state[this.ipRegister]];
      operations[cur[0]](cur, this.state);

      this.state[this.ipRegister] += 1;
      this.ticks += 1;

      if (at === 28) {
        if (!last && !wantLast) {
          return this.state[2];
        }

        if (!seen.has(this.state[2])) {
          seen.add(this.state[2]);
          last = this.state[2];
        }

        const k = `${this.state[1]}-${this.state[2]}`;
        if (seenStates.has(k)) {
          break;
        }

        seenStates.add(k);
      }
    }

    this.state[this.ipRegister] -= 1;

    return last;
  }

  stringify(at: number): string {
    const t = this.ticks.toString().padStart(8, ' ');
    const inst = this.instructions[at].join(' ').padEnd(18, ' ');
    const s = this.state.map((v) => v.toString().padStart(12, ' '));

    return `${t}:  ${at.toString().padStart(3, ' ')}  ${inst} ${s.join(' ')}`;
  }
}

/*
  See input-notes.txt for a really messy, annotated input with notes on what I was
  able to reverse-engineer.
*/
export const part1 = (input: string): number => {
  const [instructions, ipRegister] = parseInput(input);

  const r = new Runner(instructions, ipRegister);
  return r.run();
};

export const part2 = (input: string): number => {
  const [instructions, ipRegister] = parseInput(input);

  const r = new Runner(instructions, ipRegister);
  return r.run(true);
};
