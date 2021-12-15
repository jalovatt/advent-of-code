import { performance } from 'perf_hooks';

export const log = (...args: any) => {
  if (args.length) {
    process.stdout.write(args.length === 1 ? args[0] : args);
  }
  process.stdout.write('\n');
};

const timers: Record<string, number> = {};
export const time = (label: string, stop = false) => {
  const t = performance.now();
  if (timers[label]) {
    const diff = Math.trunc(t - timers[label]);
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

const counters: Record<string, number> = {};
export const counter = (label: string, done = false) => {
  if (!counters[label]) {
    counters[label] = 1;
  } else if (done) {
    log(`counter - ${label}: ${counters[label]}`);
    delete counters[label];
  } else {
    counters[label] += 1;
  }
};
