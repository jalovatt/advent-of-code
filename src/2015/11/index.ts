import circuitBreaker from '@lib/circuitBreaker';
import { log } from '@lib/logging';
import { split } from '@lib/processing';

type Password = number[];
const DisallowedChars: Set<number> = new Set([8, 11, 14]);

const LAST_DIGIT_INDEX = 7;

const mod25 = (n: number) => (n + 26) % 26;
export const parseInput = (input: string): Password => split(input, '').map((c) => c.charCodeAt(0) - 97);

const stringifyPassword = (pwd: Password): string => pwd.map((c) => String.fromCharCode(c + 97)).join('');

const mutIncrementPassword = (pwd: Password, incrementAt: number) => {
  let pos = incrementAt;

  for (let i = incrementAt + 1; i < LAST_DIGIT_INDEX; i += 1) {
    pwd[i] = 0;
  }

  let posChanged = false;
  do {
    posChanged = false;
    const cur = pwd[pos];
    let next = mod25(cur + 1);
    if (next in DisallowedChars) {
      next += 1;
    }
    pwd[pos] = next;

    if (pwd[pos] < cur) {
      pos -= 1;
      posChanged = true;
    }
  } while (posChanged);
};

export const validate = (pwd: Password, validateFrom = 0): boolean | number => {
  let hasSequence = false;
  const pairsAt: number[] = [];

  for (let i = validateFrom; i <= LAST_DIGIT_INDEX; i += 1) {
    const c = pwd[i];

    if (DisallowedChars.has(c)) { return i; }

    if (i >= 1) {
      if (pwd[i - 1] === c && (pairsAt[pairsAt.length - 1] !== i - 1)) {
        pairsAt.push(i);
      }
    }

    if (i >= 2) {
      if (c - pwd[i - 1] === 1 && pwd[i - 1] - pwd[i - 2] === 1) {
        hasSequence = true;
      }
    }
  }

  return hasSequence && pairsAt.length >= 2;
};

const getNextPassword = (input: string): string => {
  const pwd = parseInput(input);

  let result;
  while (result !== true) {
    circuitBreaker(1000000, () => log(`breaker @ ${stringifyPassword(pwd)}`));

    mutIncrementPassword(pwd, typeof result === 'number' ? result : LAST_DIGIT_INDEX);
    result = validate(pwd);
  }

  return stringifyPassword(pwd);
};

export const part1 = getNextPassword;
export const part2 = (input: string): string => getNextPassword(getNextPassword(input));
