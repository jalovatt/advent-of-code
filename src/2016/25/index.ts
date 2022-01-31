import CircuitBreaker from '@lib/CircuitBreaker';
import { dir, inspect, log } from '@lib/logging';
import { split } from '@lib/processing';

type Register = 'a' | 'b' | 'c' | 'd';
type Operation = 'cpy' | 'inc' | 'dec' | 'jnz' | 'out' | 'log' | 'add';
type Argument = number | Register;
type Instruction = [
  Operation,
  Argument,
  Argument | undefined,
];
type Memory = Record<Register | 'cursor' | 'lastTransmitted' | 'timesTransmitted', number>;

const transmit = (
  instructions: Instruction[],
  ops: Record<Operation, (x: Argument, y?: Argument) => void>,
  mem: Memory,
): boolean => {
  // Just a guess to short-circuit the process
  const TRANSMISSIONS_TO_PASS = 10;

  const breaker = new CircuitBreaker(100000, () => dir({ 'mem @ breaker': mem }));
  while (mem.cursor < instructions.length) {
    breaker.tick();

    const cmd = instructions[mem.cursor];
    ops[cmd[0]](cmd[1], cmd[2]);

    mem.cursor += 1;

    if (mem.timesTransmitted === TRANSMISSIONS_TO_PASS) {
      return true;
    }
  }

  throw new Error('Program terminated');
};

export const solve = (input: string): number => {
  const instructions: Instruction[] = split(input).map((line) => {
    const [op, xRaw, yRaw] = line.split(' ');

    const xParsed = parseInt(xRaw, 10);
    const yParsed = parseInt(yRaw, 10);

    const x = Number.isNaN(xParsed) ? xRaw as Register : xParsed;
    const y = Number.isNaN(yParsed) ? yRaw as Register : yParsed;

    return [op as Operation, x, y];
  });

  const mem: Memory = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    cursor: 0,
    lastTransmitted: -1,
    timesTransmitted: 0,
  };

  const reset = () => {
    mem.a = 0;
    mem.b = 0;
    mem.c = 0;
    mem.d = 0;
    mem.cursor = 0;
    mem.lastTransmitted = -1;
    mem.timesTransmitted = 0;
  };

  const resolve = (v: Register | number): number => (typeof v === 'number' ? v : mem[v]);

  const ops: Record<Operation, (x: Argument, y?: Argument) => void> = {
    add: (x, y) => {
      mem[x as Register] += y! as number;
    },
    cpy: (x, y) => {
      if (typeof y !== 'number') {
        mem[y as Register] = resolve(x);
      }
    },
    inc: (x) => {
      if (typeof x !== 'number') {
        mem[x as Register] += 1;
      }
    },
    dec: (x) => {
      if (typeof x !== 'number') {
        mem[x as Register] -= 1;
      }
    },
    jnz: (x, y) => {
      if (y === 0) { return; }
      if (mem[x! as Register] !== 0) {
        mem.cursor += resolve(y!) - 1;
      }
    },
    log: () => {
      log(`log @ ${mem.cursor}: ${inspect(mem)}`);
    },
    out: (x) => {
      mem.timesTransmitted += 1;

      const v = resolve(x);
      if (v !== 0 && v !== 1) {
        throw new Error(`Transmitted a non-binary character: ${x} => ${v}`);
      }

      if (v === mem.lastTransmitted) {
        throw new Error(`Transmitted ${v} twice in a row`);
      }

      mem.lastTransmitted = v;
    },
  };

  const breaker = new CircuitBreaker(1000);

  let i = 0;
  while (true) {
    breaker.tick();

    try {
      reset();
      mem.a = i;
      const result = transmit(instructions, ops, mem);
      if (result && mem.timesTransmitted) { return i; }
    // eslint-disable-next-line no-empty
    } catch {}

    i += 1;
  }
};
