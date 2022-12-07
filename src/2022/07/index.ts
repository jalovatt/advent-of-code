import { split } from '@lib/processing';

type FS = Record<string, Record<string, number | 'dir'>>;

const parseInput = (input: string): Record<string, number> => {
  const fs: FS = { '': {} };
  let cwd: string[] = [''];
  let pwd = '';

  split(input).forEach((line) => {
    // Command
    if (line.startsWith('$')) {
      pwd = cwd.join('/');

      const [, cmd, arg] = line.split(' ');

      if (cmd === 'cd') {
        if (arg === '/') {
          cwd = cwd.slice(0, 1);
        } else if (arg === '..' && cwd.length) {
          cwd.pop();
        } else {
          cwd.push(arg);
        }
      }
    // Output
    } else if (line.startsWith('dir')) {
      const dirName = line.slice(4);
      const key = `${cwd.join('/')}/${dirName}`;
      fs[pwd][key] = 'dir';
      fs[key] = {};
    } else {
      const [size, file] = line.split(' ');

      fs[pwd][file] = parseInt(size, 10);
    }
  });

  const sizes: Record<string, number> = {};

  const dirSize = (key: string): number => {
    let size = 0;

    Object.entries(fs[key]).forEach(([k, v]) => {
      if (v !== 'dir') {
        size += v;
      } else {
        size += dirSize(k);
      }
    });

    sizes[key] = size;
    return size;
  };

  dirSize('');

  return sizes;
};

export const part1 = (input: string): number => {
  const sizes = parseInput(input);
  return Object.values(sizes).filter((v) => v <= 100000).reduce((acc, cur) => acc + cur, 0);
};

const FS_SIZE = 70000000;
const NEED_SPACE = 30000000;

export const part2 = (input: string): number => {
  const sizes = parseInput(input);
  const toRemove = NEED_SPACE - (FS_SIZE - sizes['']);

  const values = Object.values(sizes).sort((a, b) => a - b);
  return values.find((v) => v > toRemove)!;
};
