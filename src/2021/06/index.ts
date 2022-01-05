class FishSchool {
  fish: number[];

  constructor(initialFish: number[]) {
    this.fish = initialFish;
  }

  update() {
    const l = this.fish.length;

    for (let i = 0; i < l; i += 1) {
      this.fish[i] -= 1;

      if (this.fish[i] < 0) {
        this.fish[i] = 6;
        this.fish.push(8);
      }
    }
  }
}

export const a = (input: string) => {
  const fish = input.split(',').map((n) => parseInt(n, 10));
  const school = new FishSchool(fish);

  for (let i = 0; i < 80; i += 1) {
    school.update();
  }

  return school.fish.length;
};

/*
Generate a variation on the Fibonacci sequence.

This implementation might be more complex than it needs to be. I started with a
an output sequence from my part A for a single fish, played around until I got the
same sequence, and then fiddled with offsets until it started at the same N

Fibonacci:  F(N) = F(N - 1) + F(N - 2)
Fishonacci: F(N - CYCLE_LENGTH) + F(N - CYCLE_LENGTH + 2)

For a cycle length of 9:

N  Value  Sum of
   0
   0
   1
   1
   1
   1
   1
   1
   1
0  1      1 + 0
1  1      1 + 0
2  2      1 + 1
3  2      1 + 1
4  2      1 + 1
5  2      1 + 1
6  2      1 + 1
7  2      day 0 + 1
8  2      day 1 + 1
9  3      day 2 + day 0
10 3      day 3 + day 1
11 4      day 4 + day 2
12 4      day 5 + day 3
13 4      day 6 + day 4
14 4      day 7 + day 5
15 4      day 8 + day 6
16 5      day 9 + day 7
*/

const generateFishonacci = (nth: number) => {
  const CYCLE_LENGTH = 9;

  const prev: { [key: number]: number } = {
    0: 1,
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
  };

  for (let i = CYCLE_LENGTH; i <= nth; i += 1) {
    const next = prev[i - CYCLE_LENGTH] + prev[i - CYCLE_LENGTH + 2];

    prev[i] = next;
  }

  return prev;
};

export const aFishonacci = (input: string) => {
  const fish = input.split(',').map((n) => parseInt(n, 10));

  const fishonacci = generateFishonacci(80);

  let sum = 0;

  fish.forEach((f) => { sum += fishonacci[80 - f + 1]; });

  return sum;
};

export const b = (input: string) => {
  const fish = input.split(',').map((n) => parseInt(n, 10));

  const fishonacci = generateFishonacci(256);

  let sum = 0;

  fish.forEach((f) => { sum += fishonacci[256 - f + 1]; });

  return sum;
};
