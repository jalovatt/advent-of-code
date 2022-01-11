import { split } from '@lib/processing';

type FullSue = {
  children: number,
  cats: number,
  samoyeds: number,
  pomeranians: number,
  akitas: number,
  vizslas: number,
  goldfish: number,
  trees: number,
  cars: number,
  perfumes: number,
};
type Sue = Partial<FullSue>;

const known = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};
const knownKeys = Object.keys(known) as (keyof FullSue)[];

const validate = (k: keyof FullSue, v: number): boolean => {
  switch (k) {
    case 'cats': { return v > known.cats; }
    case 'trees': { return v > known.trees; }
    case 'pomeranians': { return v < known.pomeranians; }
    case 'goldfish': { return v < known.goldfish; }
    default: { return v === known[k]; }
  }
};

const parseInput = (input: string): Sue[] => split(input).map((s) => {
  const [,, ...rest] = s.match(/([a-zA-Z]+|\d+)/g)!;

  const obj: Sue = {};

  for (let i = 0; i < rest.length - 1; i += 2) {
    obj[rest[i]! as keyof FullSue] = parseInt(rest[i + 1]!, 10);
  }

  return obj;
});

export const part1 = (input: string): number => {
  const sues = parseInput(input);

  sueLoop:
  for (let i = 0; i < sues.length; i += 1) {
    const s = sues[i];

    for (let j = 0; j < knownKeys.length; j += 1) {
      const k = knownKeys[j];
      if (s[k] !== undefined && s[k] !== known[k]) {
        continue sueLoop;
      }
    }

    return i + 1;
  }

  throw new Error('No matching Sue found');
};

export const part2 = (input: string): number => {
  const sues = parseInput(input);

  sueLoop:
  for (let i = 0; i < sues.length; i += 1) {
    const s = sues[i];

    for (let j = 0; j < knownKeys.length; j += 1) {
      const k = knownKeys[j];

      if (s[k] !== undefined && !validate(k, s[k]!)) {
        continue sueLoop;
      }
    }

    return i + 1;
  }

  throw new Error('No matching Sue found');
};
