import circuitBreaker from '@lib/circuitBreaker';
import { split } from '@lib/processing';

type Ingredient = {
  capacity: number,
  durability: number,
  flavor: number,
  texture: number,
  calories: number,
};
type Ingredients = Ingredient[];
type IngredientsMap = Record<number, string>;

/*
  State:
    Each ingredient can be up to 100 = 7 bits, so 28 bits altogether

    [0]     [1]     [2]     [3]
    0000000 0000000 0000000 0000000
*/
const STATE_MASK = 0b1111111;
const decodeState = (state: number, wantIndex: number): number => {
  let out = state;

  for (let i = 0; i < wantIndex; i += 1) {
    out >>>= 7;
  }

  return out & STATE_MASK;
};

export const incrementState = (state: number, incIndex: number): number => {
  let v = 1;

  for (let i = 0; i < incIndex; i += 1) {
    v <<= 7;
  }

  return state + v;
};

export const scoreState = (
  state: number,
  ingredients: Ingredients,
  needCalories: number | false = false,
): number => {
  let capacity = 0;
  let durability = 0;
  let flavor = 0;
  let texture = 0;
  let calories = 0;

  let lastAmt = 100;
  for (let i = 0; i < ingredients.length - 1; i += 1) {
    const n = decodeState(state, i);
    lastAmt -= n;

    capacity += n * ingredients[i].capacity;
    durability += n * ingredients[i].durability;
    flavor += n * ingredients[i].flavor;
    texture += n * ingredients[i].texture;
    calories += n * ingredients[i].calories;
  }

  capacity += lastAmt * ingredients[ingredients.length - 1].capacity;
  durability += lastAmt * ingredients[ingredients.length - 1].durability;
  flavor += lastAmt * ingredients[ingredients.length - 1].flavor;
  texture += lastAmt * ingredients[ingredients.length - 1].texture;
  calories += lastAmt * ingredients[ingredients.length - 1].calories;

  if (needCalories && calories !== 500) { return 0; }

  if (capacity < 0) { capacity = 0; }
  if (durability < 0) { durability = 0; }
  if (flavor < 0) { flavor = 0; }
  if (texture < 0) { texture = 0; }

  return capacity * durability * flavor * texture;
};

export const parseInput = (input: string): [Ingredients, IngredientsMap] => {
  const lines = split(input);

  const ingredients: Ingredient[] = [];
  const map: Record<number, string> = {};

  lines.forEach((line, i) => {
    const [, name, capacity, durability, flavor, texture, calories] = line.match(/(\w+):[^-\d]+([-\d]+)[^-\d]+([-\d]+)[^-\d]+([-\d]+)[^-\d]+([-\d]+)[^-\d]+([-\d]+)/)!;

    ingredients.push({
      capacity: parseInt(capacity, 10),
      durability: parseInt(durability, 10),
      flavor: parseInt(flavor, 10),
      texture: parseInt(texture, 10),
      calories: parseInt(calories, 10),
    });

    map[i] = name;
  });

  return [ingredients, map];
};

const solve = (input: string, needCalories: number | false = false): number => {
  const [ingredients] = parseInput(input);

  let maxCookie = 0;
  const cookies: Record<number, number> = {};
  const toCheck: number[] = [0];

  while (toCheck.length) {
    circuitBreaker(10000000);

    const cur = toCheck.pop()!;

    for (let i = 0; i < ingredients.length - 1; i += 1) {
      if (decodeState(cur, i) === 100) { continue; }

      const next = incrementState(cur, i);

      if (cookies[next] !== undefined) { continue; }

      const score = scoreState(next, ingredients, needCalories);
      cookies[next] = score;

      if (score > maxCookie) { maxCookie = score; }

      toCheck.push(next);
    }
  }

  return maxCookie;
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input, 500);
