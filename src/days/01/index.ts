export const a = (input: string) => {
  const arr = input.split('\n').map((n) => parseInt(n, 10));

  let increases = 0;

  for (let i = 1; i < arr.length; i += 1) {
    const n = arr[i];

    if (n > (arr[i - 1] || 0)) {
      increases += 1;
    }
  }

  return increases;
};

export const b = (input: string) => {
  const arr = input.split('\n').map((n) => parseInt(n, 10));

  let increases = 0;

  for (let i = 2; i < arr.length - 1; i += 1) {
    const left = arr[i] + arr[i - 1] + arr[i - 2];
    const right = arr[i] + arr[i - 1] + arr[i + 1];

    if (right > left) {
      increases += 1;
    }
  }

  return increases;
};
