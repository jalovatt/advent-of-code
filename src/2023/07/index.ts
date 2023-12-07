import { split } from '@lib/processing';

enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeKind,
  FullHouse,
  FourKind,
  FiveKind,
}

type Hand = {
  type: HandType;
  cards: number[];
  bid: number;
};

const replaceEach = (str: string, replacements: [string | RegExp, string][]): string => {
  let out = str;

  for (const [search, replace] of replacements) {
    out = out.replace(search, replace);
  }

  return out;
};

const getHandType = (cards: number[], jacksWild: boolean): HandType => {
  const map = cards.reduce<Map<number, number>>((acc, cur) => {
    acc.set(cur, (acc.get(cur) ?? 0) + 1);
    return acc;
  }, new Map());

  const multiples = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

  const hasWild = jacksWild && multiples.find(([card]) => card === 0);
  const wildCount = hasWild ? hasWild[1] : 0;

  if (hasWild) {
    multiples.splice(multiples.indexOf(hasWild), 1);
  }

  if (wildCount === 5 || multiples[0][1] + wildCount === 5) {
    return HandType.FiveKind;
  }

  if (multiples[0][1] + wildCount === 4) {
    return HandType.FourKind;
  }

  if (multiples[0][1] + wildCount === 3) {
    return multiples[1]?.[1] === 2
      ? HandType.FullHouse
      : HandType.ThreeKind;
  }

  if (multiples[0][1] + wildCount === 2) {
    return multiples[1][1] === 2
      ? HandType.TwoPair
      : HandType.OnePair;
  }

  return HandType.HighCard;
};

const getScore = (input: string, jacksWild = false): number => {
  const hands: Hand[] = split(input).map((line) => {
    const [cardStr, bidStr] = line.split(' ');
    const cardChars = replaceEach(cardStr, [
      [/A/g, 'E'],
      [/T/g, 'A'],
      [/J/g, jacksWild ? '0' : 'B'],
      [/Q/g, 'C'],
      [/K/g, 'D'],
    ]);

    const cards = cardChars.split('').map((char) => parseInt(char, 16));
    const type = getHandType(cards, jacksWild);

    return {
      type,
      cards,
      bid: parseInt(bidStr, 10),
    };
  }).sort((a, b) => {
    if (a.type !== b.type) {
      return a.type - b.type;
    }

    for (let i = 0; i < a.cards.length; i += 1) {
      if (a.cards[i] !== b.cards[i]) {
        return a.cards[i] - b.cards[i];
      }
    }

    return 0;
  });

  let score = 0;

  for (const [i, hand] of hands.entries()) {
    const rank = i + 1;

    score += hand.bid * rank;
  }

  return score;
};

export const part1 = (input: string): number => getScore(input);
export const part2 = (input: string): number => getScore(input, true);
