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

export const part1 = (input: string): number => {
  const [instructions, ipRegister] = parseInput(input);

  const state: State = [0, 0, 0, 0, 0, 0];

  while (state[ipRegister] >= 0 && state[ipRegister] < instructions.length) {
    const cur = instructions[state[ipRegister]];
    operations[cur[0]](cur, state);

    state[ipRegister] += 1;
  }

  state[ipRegister] -= 1;

  return state[0];
};

/*
  Sum of all factors of the target N, inclusive of 1 and N

  See input-notes.txt for an explanation of how I worked out what the program does
*/
export const part2 = (input: string): number => {
  const [instructions, ipRegister] = parseInput(input);

  const state: State = [1, 0, 0, 0, 0, 0];

  while (state[0] === 1) {
    const cur = instructions[state[ipRegister]];
    operations[cur[0]](cur, state);

    state[ipRegister] += 1;
  }

  const target = state[1];
  const limit = Math.floor(Math.sqrt(target));
  let sum = target + 1;

  for (let i = 2; i <= limit; i += 1) {
    const j = target / i;

    if (j === (j >> 0)) {
      sum += i + j;
    }
  }

  return sum;
};
