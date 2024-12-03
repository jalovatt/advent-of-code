export const part1 = (input: string): number => {
  const matches = input.matchAll(/mul\((\d+),(\d+)\)/g);

  let sum = 0;

  for (const [, a, b] of matches) {
    sum += parseInt(a, 10) * parseInt(b, 10);
  }

  return sum;
};

export const part2 = (input: string): number => {
  const matches = input.matchAll(/(mul|do|don't)\((\d*),?(\d*)\)/g);

  let active = true;
  let sum = 0;

  for (const [, instruction, a, b] of matches) {
    if (instruction === 'mul' && active && a && b) {
      sum += parseInt(a, 10) * parseInt(b, 10);
    } else {
      active = instruction === 'do';
    }
  }

  return sum;
};
