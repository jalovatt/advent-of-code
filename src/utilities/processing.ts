export const split = (str: string) => str.trim().split('\n');

export const splitToNumber = (str: string) => split(str).map((n) => parseInt(n, 10));
