import { split } from '../../utilities/processing';

type OpeningBracket = '(' | '[' | '{' | '<';
type ClosingBracket = ')' | ']' | '}' | '>';
type Bracket = OpeningBracket | ClosingBracket;

const BRACKET_PAIRS: { [key in OpeningBracket]: ClosingBracket } = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const FAILING_CHAR_SCORES: { [key in ClosingBracket]: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const PASSING_CHAR_SCORES: { [key in ClosingBracket]: number } = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const checkLine = (line: string): ClosingBracket | OpeningBracket[] => {
  const prev: OpeningBracket[] = [];

  for (let i = 0; i < line.length; i += 1) {
    const c = line[i] as Bracket;
    const last = prev[prev.length - 1];

    if (c in BRACKET_PAIRS) {
      prev.push(c as OpeningBracket);
    } else if (last in BRACKET_PAIRS && c === BRACKET_PAIRS[last]) {
      prev.pop();
    } else {
      return c as ClosingBracket;
    }
  }

  return prev;
};

const splitFilter = <T>(arr: T[], fn: (v: T, i: number, a: T[]) => Boolean): [T[], T[]] => {
  const pass = [];
  const fail = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (fn(arr[i], i, arr)) {
      pass.push(arr[i]);
    } else {
      fail.push(arr[i]);
    }
  }

  return [pass, fail];
};

const completeLine = (line: OpeningBracket[]) => {
  const remaining = [...line];
  const out: ClosingBracket[] = [];

  while (remaining.length > 0) {
    out.push(BRACKET_PAIRS[remaining.pop() as OpeningBracket]);
  }

  return out;
};

const scoreCompletion = (completion: ClosingBracket[]) => {
  let score = 0;

  for (let i = 0; i < completion.length; i += 1) {
    score *= 5;
    score += PASSING_CHAR_SCORES[completion[i]];
  }

  return score;
};

export const a = (input: string) => {
  const lines = split(input);

  const result = lines.map(checkLine);
  const [, failed] = splitFilter(result, (r) => r.length > 1) as [
    OpeningBracket[][],
    ClosingBracket[],
  ];

  const score = failed.reduce((acc, cur) => acc + FAILING_CHAR_SCORES[cur], 0);

  return score;
};

export const b = (input: string) => {
  const lines = split(input);

  const result = lines.map(checkLine);
  const [incompletes] = splitFilter(result, (r) => r.length > 1) as [
    OpeningBracket[][],
    ClosingBracket[],
  ];

  const completions = incompletes.map(completeLine);

  const scores = completions.map(scoreCompletion)
    .sort((left, right) => left - right);

  return scores[Math.floor(scores.length / 2)];
};
