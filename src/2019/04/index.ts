export const validate1 = (password: string): boolean => {
  let hasDouble = false;

  for (let cursor = 1; cursor < password.length; cursor += 1) {
    const prev = password[cursor - 1];
    const cur = password[cursor];

    if (cur === prev) {
      hasDouble = true;
    } else if (cur < prev) {
      return false;
    }
  }

  return hasDouble;
};

export const part1 = (input: string): number => {
  const [, minRaw, maxRaw] = input.match(/(\d+)-(\d+)/)!;

  const min = parseInt(minRaw, 10);
  const max = parseInt(maxRaw, 10);

  let count = 0;
  for (let v = min; v <= max; v += 1) {
    const str = v.toString();

    if (validate1(str)) {
      count += 1;
    }
  }

  return count;
};

export const validate2 = (password: string): boolean => {
  let hasDouble = false;

  for (let cursor = 1; cursor < password.length; cursor += 1) {
    const prev = password[cursor - 1];
    const cur = password[cursor];

    if (cur === prev) {
      const pPrev = password[cursor - 2];
      const next = password[cursor + 1];

      if (pPrev !== cur && next !== cur) {
        hasDouble = true;
      };
    } else if (cur < prev) {
      return false;
    }
  }

  return !!hasDouble;
};

export const part2 = (input: string): number => {
  const [, minRaw, maxRaw] = input.match(/(\d+)-(\d+)/)!;

  const min = parseInt(minRaw, 10);
  const max = parseInt(maxRaw, 10);

  let count = 0;
  for (let v = min; v <= max; v += 1) {
    const str = v.toString();

    if (validate2(str)) {
      count += 1;
    }
  }

  return count;
};
