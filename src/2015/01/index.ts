export const a = (input: string): number => {
  let floor = 0;

  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (c === '(') {
      floor += 1;
    } else {
      floor -= 1;
    }
  }

  return floor;
};

export const b = (input: string): number => {
  let floor = 0;

  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (c === '(') {
      floor += 1;
    } else {
      floor -= 1;
    }

    if (floor < 0) {
      return i + 1;
    }
  }

  throw new Error('Never reached the basement');
};
