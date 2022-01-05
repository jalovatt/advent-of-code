import { performance } from 'perf_hooks';
import util from 'util';

const timers: Record<string, number> = {};
const counters: Record<string, number> = {};

beforeEach(() => {
  Object.keys(timers).forEach((k) => delete timers[k]);
  Object.keys(counters).forEach((k) => delete counters[k]);
});

export const log = (...args: any) => {
  if (args.length) {
    process.stdout.write(`${args.length === 1 ? args[0] : args}`);
  }
  process.stdout.write('\n');
};

export const inspect = (obj: any, options = {}) => util.inspect(obj, options);

export const dir = (obj: any, options = {}) => {
  process.stdout.write(`${inspect(obj, options)}\n`);
};

export const time = (label: string, stop = false) => {
  const t = performance.now();
  if (timers[label]) {
    const diff = Math.trunc((t - timers[label]) * 100) / 100;
    log(`timer - ${label}: ${diff}ms`);

    if (stop) {
      delete timers[label];
    } else {
      timers[label] = t;
    }
  } else {
    timers[label] = t;
  }
};

export const counter = (label: string, print = false, reset = false) => {
  if (!counters[label]) {
    counters[label] = 1;
  } else {
    counters[label] += 1;
  }

  if (print) {
    log(`counter - ${label}: ${counters[label]}`);
  }

  if (reset) {
    delete counters[label];
  }
};
