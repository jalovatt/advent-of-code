import CircuitBreaker from '@lib/CircuitBreaker';
import { dir, log } from '@lib/logging';
import { split, splitToNumber } from '@lib/processing';

type OperationName = 'addr' | 'addi' | 'mulr' | 'muli' | 'banr' | 'bani' | 'borr' | 'bori' | 'setr' | 'seti' | 'gtir' | 'gtri' | 'gtrr' | 'eqir' | 'eqri' | 'eqrr';
type Operation = (inst: State, state: State) => void;
type OpcodeMap = Map<number, OperationName>;

export type State = [number, number, number, number];

type Instruction = State;
type Sample = {
  instruction: Instruction,
  before: State,
  after: State,
};

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

const allOperationEntries = Object.entries(operations) as [OperationName, Operation][];

export const parseInput = (input: string): [Sample[], State[]] => {
  const samples: Sample[] = [];
  const [samplesRaw, programRaw] = split(input, '\n\n\n');

  split(samplesRaw, '\n\n').forEach((s) => {
    const [beforeRaw, instructionRaw, afterRaw] = s.split('\n');

    const before = splitToNumber(beforeRaw.match(/\[(.+)\]/)![1], ', ') as State;
    const instruction = splitToNumber(instructionRaw, ' ') as State;
    const after = splitToNumber(afterRaw.match(/\[(.+)\]/)![1], ', ') as State;

    samples.push({ before, instruction, after });
  });

  const program = programRaw
    ? split(programRaw).map((line) => splitToNumber(line, ' ') as State)
    : [];

  return [samples, program];
};

export const testSample = (sample: Sample, exhaustive = false): OperationName[] => {
  const matchedOps: OperationName[] = [];

  opLoop:
  for (let j = 0; j < allOperationEntries.length; j += 1) {
    const op = allOperationEntries[j][1];
    const state = sample.before.concat() as State;
    op(sample.instruction, state);

    for (let k = 0; k < state.length; k += 1) {
      if (state[k] !== sample.after[k]) {
        continue opLoop;
      }
    }

    matchedOps.push(allOperationEntries[j][0]);

    if (matchedOps.length >= 3 && !exhaustive) {
      break;
    }
  }

  return matchedOps;
};

const buildOpcodeMap = (samples: Sample[]): OpcodeMap => {
  const opcodes: Map<number, OperationName> = new Map();
  const opnames = {} as Record<OperationName, number>;

  const allPossible = samples.map((s) => testSample(s, true));

  const breaker = new CircuitBreaker(10);
  while (opcodes.size < 16) {
    breaker.tick();

    for (let i = 0; i < allPossible.length; i += 1) {
      const code = samples[i].instruction[0];
      const known = opcodes.has(code);

      if (known) { continue; }

      for (let j = allPossible[i].length - 1; j >= 0; j -= 1) {
        if (opnames[allPossible[i][j]] !== undefined) {
          allPossible[i].splice(j, 1);
        }
      }

      if (allPossible[i].length === 1) {
        opnames[allPossible[i][0]] = code;
        opcodes.set(code, allPossible[i][0]);
      }
    }
  }

  return opcodes;
};

export const part1 = (input: string): number => {
  const [samples] = parseInput(input);

  let count = 0;

  for (let i = 0; i < samples.length; i += 1) {
    if (testSample(samples[i]).length >= 3) {
      count += 1;
    }
  }

  return count;
};

export const part2 = (input: string): number => {
  const [samples, program] = parseInput(input);
  const opCodeMap = buildOpcodeMap(samples);

  const state: State = [0, 0, 0, 0];

  program.forEach((inst) => {
    const op = opCodeMap.get(inst[0])!;

    operations[op](inst, state);
  });

  return state[0];
};
