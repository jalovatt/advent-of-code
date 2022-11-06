import { IntCode } from '../IntCode';

export const part1 = (input: string): number => {
  const ic = new IntCode(input, { input: [1] });
  ic.run();

  const { output } = ic;
  const code = output.pop()!;

  if (output.find((s) => s !== 0)) {
    throw new Error(`Diagnostic program found errors: ${output.join(',')}`);
  }

  return code;
};

export const part2 = (input: string): number => {
  const ic = new IntCode(input, { input: [5] });
  ic.run();

  const { output } = ic;

  return output[0];
};
