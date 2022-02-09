import { split } from '@lib/processing';

enum GuardState { Awake, Asleep }
type Observation = {
  guard: number | null,
  month: number,
  day: number,
  hour: number,
  minute: number,
  state: GuardState,
};
type GuardSchedule = Map<number, number[]>;

const getSchedule = (input: string): GuardSchedule => {
  const lines = split(input);

  const observations: Observation[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const [, month, day, hour, minute, rest] = lines[i].match(/(\d\d)-(\d\d) (\d\d):(\d\d)\] (.+)$/)!;
    const [, change] = rest.match(/(\d+|falls|wakes)/)!;

    let state: GuardState;
    let guard: number | null = null;

    if (change === 'falls') {
      state = GuardState.Asleep;
    } else if (change === 'wakes') {
      state = GuardState.Awake;
    } else {
      state = GuardState.Awake;
      guard = parseInt(change, 10);
    }

    const obs = {
      guard: guard ?? null,
      month: parseInt(month, 10),
      day: parseInt(day, 10),
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
      state,
    };

    if (obs.hour === 23) {
      obs.day += 1;
      obs.hour = 0;
      obs.minute = 0;
    }

    observations.push(obs);
  }

  observations.sort((a, b) => {
    if (a.month !== b.month) { return a.month - b.month; }
    if (a.day !== b.day) { return a.day - b.day; }
    if (a.hour !== b.hour) { return a.hour - b.hour; }
    return a.minute - b.minute;
  });

  const guardSchedule: GuardSchedule = new Map();

  let guard: number | null = null;
  let state = GuardState.Asleep;

  let next = 0;
  let t = 0;

  while (next < observations.length) {
    if (t === 60) {
      t = 0;
      guard = null;
    } else if (t >= observations[next].minute) {
      if (observations[next].guard) {
        guard = observations[next].guard;
      }
      state = observations[next].state;
      t = observations[next].minute;

      next += 1;
    }

    if (guard && state === GuardState.Asleep) {
      if (!guardSchedule.has(guard)) {
        guardSchedule.set(guard, new Array(60).fill(0));
      }

      const s = guardSchedule.get(guard)!;
      s[t] += 1;
    }

    t += 1;
  }

  return guardSchedule;
};

export const part1 = (input: string): number => {
  const guardSchedule = getSchedule(input);

  const sleepiestGuard = Array.from(guardSchedule.entries()).sort((a, b) => {
    const aMinutes = a[1].reduce((acc, cur) => acc + cur, 0);
    const bMinutes = b[1].reduce((acc, cur) => acc + cur, 0);

    return bMinutes - aMinutes;
  })[0];

  const max = {
    count: 0,
    minute: 0,
  };

  for (let i = 0; i < sleepiestGuard[1].length; i += 1) {
    if (sleepiestGuard[1][i] > max.count) {
      max.count = sleepiestGuard[1][i];
      max.minute = i;
    }
  }

  return sleepiestGuard[0] * max.minute;
};

export const part2 = (input: string): number => {
  const guardSchedule = getSchedule(input);

  const max = {
    count: 0,
    minute: 0,
    guard: 0,
  };

  for (const e of guardSchedule.entries()) {
    for (let i = 0; i < e[1].length; i += 1) {
      if (e[1][i] > max.count) {
        max.count = e[1][i];
        max.minute = i;
        max.guard = e[0];
      }
    }
  }

  return max.guard * max.minute;
};
