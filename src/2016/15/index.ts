import CircuitBreaker from '@lib/CircuitBreaker';
import { split } from '@lib/processing';

/*
  p = starting position (from 0), takes 1s to reach the first disc
  n = disc # (from 0)
  l = # positions

  f(t) s.t 0  = (t + p + n + 1) % l
                     \_______/
                         c

              = (t + c) % l

  [
    [c, l]
  ]

  Since t has to be a value for which all of our equations = 0, we can use
  the equation with the largest l as a base.

  t0 = first time when this disc is at 0
  t += l on each loop
*/

const checkTime = (t: number, system: [number, number][]): boolean => {
  for (let i = 0; i < system.length; i += 1) {
    const result = (t + system[i][0]) % system[i][1];

    if (result) { return false; }
  }

  return true;
};

export const solve = (input: string): number => {
  const system: [number, number][] = split(input).map((line, i) => {
    const [, lRaw, pRaw] = line.match(/has (\d+).+position (\d+)/)!;

    const l = parseInt(lRaw, 10);
    const p = parseInt(pRaw, 10);
    const c = p + i + 1;

    return [c, l];
  });

  /*
    Sort so the largest mods are first; we need the largest one to start from,
    and larger mods are less likely to be valid so we'll short circuit faster
  */
  system.sort((a, b) => b[1] - a[1]);

  let t = (2 * system[0][1] - system[0][0]) % system[0][1];

  const breaker = new CircuitBreaker(1000000);
  while (true) {
    breaker.tick();

    if (checkTime(t, system)) {
      return t;
    }

    t += system[0][1];
  }
};
