export const split = (str: string, splitBy: string | RegExp = '\n') => str.trim().split(splitBy);

export const split2D = (
  str: string,
  splitByRows: string | RegExp = '\n',
  splitByCols: string | RegExp = '',
) => str.trim().split(splitByRows).map((row) => row.split(splitByCols));

export const splitToNumber = (str: string, splitBy?: string | RegExp) => (
  split(str, splitBy).map((n) => parseInt(n, 10))
);
