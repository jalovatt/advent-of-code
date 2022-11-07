import { IntCode, RunState } from '../IntCode';

const PHASES_1 = [0, 1, 2, 3, 4];
const PHASES_2 = [5, 6, 7, 8, 9];

/*
  Heap's Algorithm, non-recursive version
  https://en.wikipedia.org/wiki/Heap%27s_algorithm

  Adapted from: https://www.baeldung.com/cs/array-generate-all-permutations
*/
function* permutations<T>(arr: T[]) {
  const working = [...arr];
  yield working;

  const buffer = new Array(arr.length).fill(0);

  let i = 0;
  while (i < arr.length) {
    if (buffer[i] < i) {
      if (i % 2 === 0) {
        const tmp = working[0];
        working[0] = working[i];
        working[i] = tmp;
      } else {
        const tmp = working[buffer[i]];
        working[buffer[i]] = working[i];
        working[i] = tmp;
      }

      yield working;
      buffer[i] += 1;
      i = 0;
    } else {
      buffer[i] = 0;
      i += 1;
    }
  }
}

const findMaxOutput = (input: string, phaseValues: number[]): number => {
  const phasePermutations = permutations(phaseValues);
  const outputs: number[] = [];

  for (const perm of phasePermutations) {
    const ics = new Array(5).fill(null).map((v, i) => (
      new IntCode(input, { input: [perm[i]] })
    ));

    ics[0].input.push(0);

    let i = 0;
    let lastOutput: number;
    while (ics[4].runState !== RunState.Halted) {
      ics[i].run();

      lastOutput = ics[i].output.pop()!;

      i += 1;
      if (i === 5) {
        i = 0;
      }

      ics[i].input.push(lastOutput);
    }

    outputs.push(lastOutput!);
  }

  return Math.max(...outputs);
};

export const part1 = (input: string): number => findMaxOutput(input, PHASES_1);
export const part2 = (input: string): number => findMaxOutput(input, PHASES_2);
