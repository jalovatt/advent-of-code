export const split = (str: string, splitBy: string | RegExp = '\n') => str.trim().split(splitBy);

export const splitToNumber = (str: string, splitBy?: string | RegExp) => (
  split(str, splitBy).map((n) => parseInt(n, 10))
);
