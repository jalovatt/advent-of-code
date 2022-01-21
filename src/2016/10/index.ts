import { split } from '@lib/processing';

namespace Bot {
  export type Empty = { id: number, givesTo: [number?, number?], values: [number?, number?] };
  export interface Ready extends Empty { givesTo: [number, number], values: [number, number] }
}

// Values are all primes
const solve = (input: string, findBotComparing?: [number, number]): number => {
  const lines = split(input);
  const COMPARE_PRODUCT: number | false = (typeof findBotComparing !== 'undefined')
    && (findBotComparing[0] * findBotComparing[1]);

  const bots: Bot.Empty[] = [];
  const toCheck: Bot.Ready[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i][0] === 'v') {
      const [, vRaw, idRaw] = lines[i].match(/(\d+).+?(\d+)/)!;

      const v = parseInt(vRaw, 10);
      const id = parseInt(idRaw, 10);

      if (!bots[id]) {
        bots[id] = { id, givesTo: [], values: [] };
      }

      bots[id].values.push(v);

      if (bots[id].values.length === 2) {
        toCheck.push(bots[id] as Bot.Ready);
      }
    } else {
      // bot 2 gives low to bot 1 and high to bot 0
      const match = lines[i].match(/(\d+).+?(output|bot) (\d+).+?(output|bot) (\d+)/);
      const [, idRaw, lowTarget, lowRaw, highTarget, highRaw] = match!;

      const id = parseInt(idRaw, 10);
      const low = parseInt(lowRaw, 10);
      const high = parseInt(highRaw, 10);

      if (!bots[id]) {
        bots[id] = { id, givesTo: [], values: [] };
      }

      bots[id].givesTo = [
        lowTarget === 'output' ? low + 1000 : low,
        highTarget === 'output' ? high + 1000 : high,
      ];
    }
  }

  const outputs: Record<number, number> = {};

  while (toCheck.length) {
    const cur = toCheck.pop()!;

    if (COMPARE_PRODUCT && cur.values[0]! * cur.values[1]! === COMPARE_PRODUCT) {
      return cur.id;
    }

    if (cur.values[0] > cur.values[1]) {
      const temp = cur.values[0];
      cur.values[0] = cur.values[1];
      cur.values[1] = temp;
    }

    const low = cur.values[0];
    const lowTarget = cur.givesTo[0];
    if (lowTarget >= 1000) {
      outputs[lowTarget - 1000] = low;
    } else {
      const lowBot = bots[lowTarget];
      lowBot.values.push(low);
      if (lowBot.values.length === 2) {
        toCheck.push(lowBot as Bot.Ready);
      }
    }

    const high = cur.values[1];
    const highTarget = cur.givesTo[1];
    if (highTarget >= 1000) {
      outputs[highTarget - 1000] = high;
    } else {
      const highBot = bots[highTarget];
      highBot.values.push(high);
      if (highBot.values.length === 2) {
        toCheck.push(highBot as Bot.Ready);
      }
    }
  }

  return outputs[0] * outputs[1] * outputs[2];
};

export const part1 = solve;
export const part2 = (input: string): number => solve(input);
