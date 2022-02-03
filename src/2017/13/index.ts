import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

/*
  A layer N elements deep with a scanner that goes to the end and comes back
  is equivalent to a loop % 2(N - 1)

  N = 3:                N = 4:
    0 1 2 1 0             0 1 2 3 2 1 0
    0 1 2 3 0   % 4       0 1 2 3 4 5 0   % 6

  Given the example:

   0   1   2   3   4   5   6
  [ ] [ ] ... ... [ ] ... [ ]
  [ ] [ ]         [ ]     [ ]
  [ ]             [ ]     [ ]
                  [ ]     [ ]

  We need to find T such that:
     T      % 4 !== 0
    (T + 1) % 2 !== 0
    (T + 4) % 6 !== 0
    (T + 6) % 6 !== 0
*/

type Layer = { index: number, depth: number, cycle: number };

const parseInput = (input: string): Layer[] => split(input).map((line) => {
  const [index, depth] = line.match(/\d+/g)!.map((n) => parseInt(n, 10));

  return { index, depth, cycle: 2 * (depth - 1) };
});

export const part1 = (input: string): number => {
  const layers = parseInput(input);
  let severity = 0;

  for (let i = 0; i < layers.length; i += 1) {
    if ((layers[i].index % layers[i].cycle) === 0) {
      severity += (layers[i].index * layers[i].depth);
    }
  }

  return severity;
};

export const part2 = (input: string): number => {
  const layers = parseInput(input);

  // Check the layers with smaller cycles first; they'll catch us more often
  layers.sort((a, b) => a.cycle - b.cycle);

  let t = 0;

  // Must be even; example and input both have a depth=2 at pos=1
  const inc = 2;

  const breaker = new CircuitBreaker(10000000);
  while (true) {
    breaker.tick();

    let caught = false;
    for (let i = 0; i < layers.length; i += 1) {
      if ((t + layers[i].index) % layers[i].cycle === 0) {
        caught = true;
        break;
      }
    }

    if (!caught) {
      return t;
    }

    t += inc;
  }
};
