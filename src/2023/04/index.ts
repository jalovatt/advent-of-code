import { split } from '@lib/processing';

type Card = {
  id: string;
  winning: Set<string>;
  numbers: Set<string>;
};

const intersection = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const out: Set<T> = new Set();

  for (const v of a.values()) {
    if (b.has(v)) {
      out.add(v);
    }
  }

  return out;
};

const parseInput = (input: string): Card[] => split(input)
  .map((card) => {
    const [, idStr, winningStr, numbersStr] = card.match(/Card +(\d+): +(.+) \| +(.+)/)!;

    return {
      id: idStr,
      winning: new Set(winningStr.split(/ +/)),
      numbers: new Set(numbersStr.split(/ +/)),
    };
  });

export const part1 = (input: string): number => {
  const cards = parseInput(input);

  return cards.reduce<number>((acc, cur) => {
    const winners = intersection(cur.winning, cur.numbers);
    let cardScore = 0;

    if (winners.size) {
      cardScore = 1 << (winners.size - 1);
    }

    return acc + cardScore;
  }, 0);
};

export const part2 = (input: string): number => {
  const cards = parseInput(input);

  const copies: Map<string, number> = new Map(cards.map(({ id }) => [id, 1]));

  return cards.reduce<number>((acc, cur, i) => {
    const winners = intersection(cur.winning, cur.numbers);
    const n = copies.get(cur.id)!;

    if (winners.size) {
      for (let j = i + 1; j <= i + winners.size; j += 1) {
        const { id } = cards[j];
        copies.set(id, copies.get(id)! + n);
      }
    }

    return acc + n;
  }, 0);
};
