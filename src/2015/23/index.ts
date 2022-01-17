import { split } from '@lib/processing';

type Register = 'a' | 'b';
type Memory = { a: number, b: number, cursor: number };
type Command = 'hlf' | 'tpl' | 'inc' | 'jmp' | 'jie' | 'jio';
type Commands = Record<Command, (m: Memory, a: Register | number, b?: number) => number | void>;
type Instruction = { cmd: Command, a: Register | number, b?: number };

const commands: Commands = {
  hlf: (m, a) => {
    m[a as Register] = (m[a as Register] / 2) >>> 0;
    m.cursor += 1;
  },
  tpl: (m, a) => { m[a as Register] *= 3; m.cursor += 1; },
  inc: (m, a) => { m[a as Register] += 1; m.cursor += 1; },
  jmp: (m, a) => { m.cursor += a as number; },
  jie: (m, a, b) => { m.cursor += (m[a as Register] % 2) ? 1 : b!; },
  jio: (m, a, b) => { m.cursor += (m[a as Register] === 1) ? b! : 1; },
};

const parseInput = (input: string): Instruction[] => split(input).map((line) => {
  const [, cmd, a, b] = line.match(/^(\w{3}) ([a-z\-+\d]+),? ?([a-z\-+\d]+)?$/)!;
  const aParsed = parseInt(a, 10);

  return {
    cmd: cmd as Command,
    a: Number.isNaN(aParsed) ? a as Register : aParsed,
    b: parseInt(b, 10),
  };
});

const run = (input: string, outputRegister: Register, part2 = false): number => {
  const instructions = parseInput(input);

  const mem: Memory = { a: part2 ? 1 : 0, b: 0, cursor: 0 };

  while (mem.cursor < instructions.length) {
    const instruction = instructions[mem.cursor];
    commands[instruction.cmd](mem, instruction.a, instruction.b);
  }

  return mem[outputRegister];
};

export const part1 = run;
export const part2 = (input: string, out: Register): number => run(input, out, true);
