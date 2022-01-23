import { dir } from '@lib/logging';
import { split } from '@lib/processing';

type Maybe<T> = T | null;
type MemAddress = 'w' | 'x' | 'y' | 'z';
type Instruction = { op: string, l?: MemAddress, r?: MemAddress | number };

export const parseIfInt = (n: Maybe<string>): Maybe<number | string> => {
  const parsed = (typeof n === 'string') ? parseInt(n, 10) : n;

  return (typeof parsed === 'number' && !Number.isNaN(parsed)) ? parsed : n;
};

const parseInstructions = (input: string): Instruction[] => split(input)
  .filter(Boolean)
  .map((line) => {
    const [op, l, r] = line.split(' ');

    if (!op || op === '//') return null;
    if (op === 'log' || op === 'spc') return { op };

    const rParsed = parseIfInt(r);
    return { op, l, r: rParsed };
  })
  .filter(Boolean) as Instruction[];

const compute = (instructions: Instruction[], args: number[] = []) => {
  const mem = { w: 0, x: 0, y: 0, z: 0 };

  let argIndex = 0;

  for (let i = 0; i < instructions.length; i += 1) {
    const { op, l, r } = instructions[i];

    const rParsed = (typeof r === 'string') ? mem[r] : r;

    // eslint-disable-next-line default-case
    switch (op) {
      case 'inp': {
        mem[l!] = args[argIndex];
        argIndex += 1;
        break;
      }
      case 'add': {
        mem[l!] += rParsed!;
        break;
      }
      case 'mul': {
        mem[l!] *= rParsed!;
        break;
      }
      case 'div': {
        const v = mem[l!] / rParsed!;
        mem[l!] = (v > 0) ? Math.trunc(v) : Math.ceil(v);
        break;
      }
      case 'mod': {
        mem[l!] %= rParsed!;
        break;
      }
      case 'eql': {
        mem[l!] = (mem[l!] === rParsed) ? 1 : 0;
        break;
      }
      case '//': {
        break;
      }
      case 'log': {
        dir(mem);
        break;
      }
    }
  }

  return mem;
};

const solveStepPair = (
  push: Instruction[],
  pop: Instruction[],
  solveForMin = false,
): Maybe<[number, number]> => {
  const [l1, l2, l3] = solveForMin ? [1, 10, 1] : [9, 0, -1];

  for (let w1 = l1; w1 !== l2; w1 += l3) {
    for (let w2 = l1; w2 !== l2; w2 += l3) {
      const result = compute([...push, ...pop], [w1, w2]);

      if (result.z === 0) {
        return [w1, w2];
      }
    }
  }

  return null;
};

const prepareSteps = (instructions: Instruction[]): [Instruction[][], [number, number][]] => {
  const steps: Instruction[][] = [];
  const stepStack: number[] = [];
  const stepPairs: [number, number][] = [];

  let isPopStep = false;
  for (let i = 0; i < instructions.length; i += 1) {
    const instruction = instructions[i];
    if (instruction.op === 'inp') {
      if (!isPopStep) {
        stepStack.push(steps.length - 1);
      }
      steps.push([]);
      isPopStep = false;
    } else if (instruction.op === 'div' && instruction.l === 'z') {
      const pair = stepStack.pop()!;
      stepPairs.push([pair, steps.length - 1]);
      isPopStep = true;
    }

    steps[steps.length - 1].push(instruction);
  }

  return [steps, stepPairs];
};

const solve = (input: string, solveForMin = false): number => {
  const instructions = parseInstructions(input);
  const [steps, stepPairs] = prepareSteps(instructions);

  const maxDigits = new Array(14);
  // eslint-disable-next-line guard-for-in
  for (const pair of stepPairs) {
    const push = pair[0];
    const pop = pair[1];
    const solved = solveStepPair(steps[push], steps[pop], solveForMin)!;

    maxDigits[push] = solved[0];
    maxDigits[pop] = solved[1];
  }

  // Object.entries(stepPairs).forEach(([push, pop]) => {
  //   const solved = solveStepPair(steps[push], steps[pop], solveForMin);
  //   if (solved === null) { throw new Error(`No solution found for steps ${push} => ${pop}`); }
  //   maxDigits[push] = solved[0];
  //   maxDigits[pop] = solved[1];
  // });

  return parseInt(maxDigits.join(''), 10);
};

export const a = (input: string) => solve(input);
export const b = (input: string) => solve(input, true);
