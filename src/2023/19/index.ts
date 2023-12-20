import { dir } from '@lib/logging';
import { split2D } from '@lib/processing';

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
  rating: number;
};

type Category = keyof Omit<Part, 'rating'>;
type Comparator = '<' | '>';

type Condition = {
  category: Category;
  comparator: Comparator;
  value: number;
};

type Rule = {
  condition?: Condition;
  dest: string | boolean;
};

type Workflow = {
  id: string;
  rules: Rule[]
};

type Range = [number, number];
type PartRange = Record<Category, Range>;

const parseInput = (input: string): [Map<string, Workflow>, Part[]] => {
  const parts: Part[] = [];
  const workflows: Map<string, Workflow> = new Map();

  const [workflowLines, partLines] = split2D(input, '\n\n', '\n');

  // TODO: Filter/simplify workflows where all rules have the same dest
  for (const l of workflowLines) {
    const [, id, ruleStr] = l.match(/^(\w+)\{(.+)\}$/)!;

    const workflow: Workflow = { id, rules: [] };
    for (const str of ruleStr.split(',')) {
      const comparatorMatch = str.match(/(\w)([<>])(\d+):(\w+)/);

      if (comparatorMatch) {
        const [, category, comparator, value, dest] = comparatorMatch;
        workflow.rules.push({
          condition: {
            category: category as Category,
            comparator: comparator as Comparator,
            value: parseInt(value, 10),
          },
          dest: dest.length > 1 ? dest : dest === 'A',
        });
      } else if (str.length > 1) {
        workflow.rules.push({ dest: str });
      } else {
        workflow.rules.push({ dest: str === 'A' });
      }
    }

    workflows.set(workflow.id, workflow);
  }

  for (const l of partLines) {
    const p = { rating: 0 } as Part;
    const match = l.matchAll(/(\w)=(\d+)/g);

    for (const [, category, value] of match) {
      const v = parseInt(value, 10);
      p[category as Category] = v;
      p.rating += v;
    }

    parts.push(p);
  }

  return [workflows, parts];
};

const checkCondition = (c: Condition, p: Part): boolean => (
  c.comparator === '>'
    ? p[c.category] > c.value
    : p[c.category] < c.value
);

export const part1 = (input: string): number => {
  const [workflows, parts] = parseInput(input);

  const accepted: Part[] = [];

  const applyWorkflow = (id: string, p: Part): boolean => {
    const w = workflows.get(id)!;

    if (!w) {
      throw new Error(`Rule ${id} was not found`);
    }

    for (const r of w.rules) {
      if (!r.condition || checkCondition(r.condition, p)) {
        if (typeof r.dest === 'boolean') {
          return r.dest;
        }

        if (r.dest === 'A') {
          dir(w, { depth: 4 });
        }

        // TODO: Stack overflow possible here?
        return applyWorkflow(r.dest, p);
      }
    }

    throw new Error(`Rule ${id}, part ${JSON.stringify(p)} terminated unexpectedly`);
  };

  for (const p of parts) {
    const result = applyWorkflow('in', p);

    if (result) {
      accepted.push(p);
    }
  }

  let totalRating = 0;
  for (const p of accepted) {
    totalRating += p.rating;
  }

  return totalRating;
};

export const part2 = (input: string): number => {
  const [workflows] = parseInput(input);

  const workflowArr = [...workflows.values()];

  const updateWorkflowDestinationsPointingTo = (id: string, newDest: string | boolean) => {
    for (const w of workflowArr) {
      for (const r of w.rules) {
        if (r.dest === id) {
          r.dest = newDest;
        }
      }
    }
  };

  let changed = false;
  do {
    changed = false;
    for (let i = workflowArr.length - 1; i >= 0; i -= 1) {
      const w = workflowArr[i];

      if (w.rules.every((r) => r.dest === w.rules[0].dest)) {
        updateWorkflowDestinationsPointingTo(w.id, w.rules[0].dest);
        workflowArr.splice(i, 1);

        changed = true;
      }
    }
  } while (changed);

  const filteredWorkflows: Map<string, Workflow> = new Map();
  for (const w of workflowArr) {
    filteredWorkflows.set(w.id, w);
  }

  const accepted: PartRange[] = [];
  const toCheck: { range: PartRange, id: string }[] = [{
    id: 'start',
    range: {
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    },
  }];
  // Walk through the tree, creating ranges on either side of each comparator,
  // eventually resolving each split->split->split range to either A or R
  while (toCheck.length) {
    const cur = toCheck.pop()!;
    const w = workflows.get(cur.id)!;

    for (const r of w.rules) {
      if (!r.condition) {
        if (typeof r.dest === 'boolean') {
          if (r.dest) {
            accepted.push(cur.range);
          }
        }
      } else {
        // TODO
        reduceRange(cur, r.condition);
      }
    }
  }

  dir({
    nBefore: workflows.size,
    nAfter: workflowArr.length,
  });
};
