import { IntCode } from '../IntCode';

export const getFinalState = (input: string): string => new IntCode(input)
  .run()
  .join(',');

export const part1 = (input: string): number => {
  const state = new IntCode(input, { replaceInitialState: [[1, 12], [2, 2]] })
    .run();

  return state[0];
};

export const part2 = (input: string): number => {
  let state;

  let a = 0;
  let b = 0;

  while (a < 100 && b < 100) {
    state = new IntCode(input, { replaceInitialState: [[1, a], [2, b]] })
      .run();

    if (state[0] === 19690720) {
      break;
    }

    b += 1;

    if (b === 100) {
      b = 0;
      a += 1;
    }
  }

  return 100 * a + b;
};
