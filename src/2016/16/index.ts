import { split } from '@lib/processing';

const expandData = (state: number[], length: number) => {
  while (state.length < length) {
    state.push(0);

    for (let i = state.length - 2; i >= 0; i -= 1) {
      state.push(1 - state[i]);
    }
  }

  state.length = length;
};

const reduceChecksum = (state: number[]) => {
  let l = state.length;

  while (!(l & 1)) {
    for (let i = 0, t = 0; i < state.length; i += 2, t += 1) {
      state[t] = (state[i] === state[i + 1]) ? 1 : 0;
    }

    l /= 2;
  }

  state.length = l;
};

/*
  My initial solution was entirely bitshifting, but it couldn't handle P2; just
  expanding the data would take at least half an hour. One of the few times where
  a giant array is the better option.
*/
export const solve = (input: string, length: number): string => {
  const state = split(input, '').map((n) => parseInt(n, 10));

  expandData(state, length);
  reduceChecksum(state);

  return state.join('');
};
