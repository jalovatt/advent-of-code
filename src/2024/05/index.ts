import { split, split2D } from '@lib/processing';

type Rule = { value: string, to: Set<Rule>, from: Set<Rule> };
type Rules = Record<string, Rule>;
type Updates = string[][];

const parseInput = (input: string): [Rules, Updates] => {
  const [rawRules, rawUpdates] = split(input, '\n\n');

  const rules: Rules = {};
  rawRules.split('\n').forEach((line) => {
    const [a, b] = line.split('|');

    if (!rules[a]) {
      rules[a] = { value: a, to: new Set(), from: new Set() };
    }

    if (!rules[b]) {
      rules[b] = { value: b, to: new Set(), from: new Set() };
    }

    rules[a].to.add(rules[b]);
    rules[b].from.add(rules[a]);
  });

  const updates = split2D(rawUpdates, '\n', ',');
  return [rules, updates];
};

const filterValidUpdates = (
  rules: Rules,
  updates: Updates,
  inverse = false,
) => updates.filter((update) => {
  for (let i = 0; i < update.length - 1; i += 1) {
    const a = update[i];
    const b = update[i + 1];

    if (!rules[a].to.has(rules[b])) {
      return inverse;
    }
  }

  return !inverse;
});

const getParsedMiddle = (update: string[]): number => {
  const i = (update.length / 2) >> 0;

  return parseInt(update[i], 10);
};

const sumMiddleValues = (updates: Updates): number => updates.reduce((acc, cur) => {
  const v = getParsedMiddle(cur);

  return acc + v;
}, 0);

export const part1 = (input: string): number => {
  const [rules, updates] = parseInput(input);
  const valid = filterValidUpdates(rules, updates);

  return sumMiddleValues(valid);
};

export const part2 = (input: string): number => {
  const [rules, updates] = parseInput(input);
  const invalid = filterValidUpdates(rules, updates, true);

  const reordered: Updates = [];

  invalid.forEach((update) => {
    const relevantRuleKeys = new Set(update);

    // The full input has at least one cycle, but if we only take the rules
    // relevant to this update they're guaranteed to be safe.
    const relevantRules: Rules = {};

    // eslint-disable-next-line guard-for-in
    for (const k in rules) {
      const v = rules[k];

      if (relevantRuleKeys.has(k)) {
        const filteredRule: Rule = {
          value: k,
          from: new Set(),
          to: new Set(),
        };

        // .from and .to will have *original* nodes, not filtered for this update,
        // so we will have to check for the relevant ones any time we access them. :(
        for (const node of v.from.values()) {
          if (relevantRuleKeys.has(node.value)) {
            filteredRule.from.add(node);
          }
        }

        for (const node of v.to.values()) {
          if (relevantRuleKeys.has(node.value)) {
            filteredRule.to.add(node);
          }
        }

        relevantRules[k] = filteredRule;
      }
    }

    // Find the only node in this update with no relevant parents
    let start: Rule;

    // eslint-disable-next-line guard-for-in
    findStartLoop: for (const k in relevantRules) {
      const rule = relevantRules[k];

      for (const fromNode of rule.from.values()) {
        if (relevantRuleKeys.has(fromNode.value)) {
          continue findStartLoop;
        }
      }

      start = rule;
      break;
    }

    const toCheck: Rule[] = [];
    for (const nextNode of start!.to.values()) {
      if (relevantRuleKeys.has(nextNode.value)) {
        toCheck.push(nextNode);
      }
    }

    const distances: Record<string, number> = { [start!.value]: 0 };

    toCheckLoop: while (toCheck.length) {
      const cur = toCheck.shift()!;

      const parentDistances = [];

      let newMax = 0;

      // If we have all of the parent distances for this node, get the max of them.
      for (const fromNode of cur.from.values()) {
        if (relevantRuleKeys.has(fromNode.value)) {
          parentDistances.push(distances[fromNode.value]);

          const distance = distances[fromNode.value];

          if (distances[fromNode.value] === undefined) {
            toCheck.push(cur);
            continue toCheckLoop;
          } else {
            newMax = distance > newMax ? distance : newMax;
          }
        }
      }

      // If we don't have all of the parent distances yet, put it back in the queue for later.
      if (Number.isNaN(newMax)) {
        toCheck.push(cur);

      // Store this node's distance
      } else {
        distances[cur.value] = newMax + 1;
      }
    }

    update.sort((a, b) => distances[a] - distances[b]);
    reordered.push(update);
  });

  return sumMiddleValues(reordered);
};
