import { split } from '../../utilities/processing';

/*
  Forward += x
  Down += y
  Up -= y
*/
export const a = (input: string) => {
  const cmds = split(input);

  let x = 0;
  let y = 0;

  cmds.forEach((line) => {
    const matched = line.match(/(\w+) (\d+)/) as string[];

    const cmd = matched[1];
    const amt = parseInt(matched[2], 10);

    if (cmd === 'down') {
      y += amt;
    } else if (cmd === 'up') {
      y -= amt;
    } else {
      x += amt;
    }
  });

  return x * y;
};

export const b = (input: string) => {
  const cmds = split(input);

  let x = 0;
  let y = 0;
  let aim = 0;

  cmds.forEach((line) => {
    const matched = line.match(/(\w+) (\d+)/) as string[];

    const cmd = matched[1];
    const amt = parseInt(matched[2], 10);

    if (cmd === 'down') {
      aim += amt;
    } else if (cmd === 'up') {
      aim -= amt;
    } else {
      x += amt;
      y += amt * aim;
    }
  });

  return x * y;
};
