type Stack = string[];
type Instruction = [string, string, string];

const parseInput = (input: string): [Record<string, Stack>, Instruction[]] => {
  const [stackStr, instructionStr] = input.split('\n\n');
  const stackLines = stackStr.split('\n');
  stackLines.pop(); // the index row

  const stacks: Record<string, Stack> = {};

  stackLines.forEach((line) => {
    if (!line) { return; }
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];

      if (!c.match(/[A-Z]/)) {
        continue;
      }

      const index = Math.ceil((i - 1) / 4) + 1;

      if (!stacks[index]) {
        stacks[index] = [];
      }

      stacks[index].unshift(c);
    }
  });

  const instructions = instructionStr.trim().split('\n')
    .map((line) => line.split(/[^0-9]+/).filter(Boolean));

  return [stacks, instructions as Instruction[]];
};

export const part1 = (input: string): string => {
  const [stacks, instructions] = parseInput(input);

  instructions.forEach(([nRaw, src, dest]) => {
    const n = +nRaw;

    for (let i = 0; i < n; i += 1) {
      if (stacks[src].length) {
        stacks[dest].push(stacks[src].pop()!);
      }
    }
  });

  const chars: string[] = [];
  for (let i = 1; i <= 9; i += 1) {
    chars.push(stacks[i]?.pop() ?? '');
  }

  return chars.filter(Boolean).join('');
};

export const part2 = (input: string): string => {
  const [stacks, instructions] = parseInput(input);

  instructions.forEach(([nRaw, src, dest]) => {
    const n = +nRaw;

    const moving = [];
    for (let i = 0; i < n; i += 1) {
      if (stacks[src].length) {
        moving.unshift(stacks[src].pop()!);
      }
    }

    stacks[dest].push(...moving);
  });

  const chars: string[] = [];
  for (let i = 1; i <= 9; i += 1) {
    chars.push(stacks[i]?.pop() ?? '');
  }

  return chars.filter(Boolean).join('');
};
