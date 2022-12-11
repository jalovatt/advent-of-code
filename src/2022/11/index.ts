import { split } from '@lib/processing';

type Operand = '*' | '/' | '+' | '-';
type Operation = [Operand, number | 'old'];
type Test = {
  divisibleBy: number;
  ifTrue: number;
  ifFalse: number;
};

type Monkey = {
  items: number[];
  operation: Operation;
  test: Test;
  nInspected: number;
};

const performOperation = (a: number, operation: Operation) => {
  const b = operation[1] === 'old' ? a : operation[1];
  switch (operation[0]) {
    case '*': return a * b;
    case '/': return a / b;
    case '+': return a + b;
    default: return a - b;
  }
};

const parseInput = (input: string): Monkey[] => split(input, '\n\n')
  .map((block) => {
    const lines = block.split('\n');

    const items = lines[1].match(/items: (.+)$/)![1];
    const [, operand, n] = lines[2].match(/= old (.) (.+)$/)!;
    const [, divisibleBy] = lines[3].match(/(\d+)$/)!;
    const [, t] = lines[4].match(/(\d+)/)!;
    const [, f] = lines[5].match(/(\d+)/)!;

    return {
      items: items.split(', ').map((nRaw) => parseInt(nRaw, 10)),
      operation: [operand as Operand, parseInt(n, 10) || n as 'old'],
      test: {
        divisibleBy: parseInt(divisibleBy, 10),
        ifTrue: parseInt(t, 10),
        ifFalse: parseInt(f, 10),
      },
      nInspected: 0,
    };
  });

const run = (input: string, part2 = false) => {
  const monkeys = parseInput(input);

  /*
    I could see that the optimization here involves %, since all of the monkeys'
    tests are prime numbers, but drew a blank on what to do. Cheers to Reddit.
  */
  const lcm = monkeys.reduce((acc, m) => acc * m.test.divisibleBy, 1);

  const times = part2 ? 10000 : 20;
  for (let i = 0; i < times; i += 1) {
    monkeys.forEach((m) => {
      while (m.items.length) {
        const n = m.items.shift()!;

        let v = performOperation(n, m.operation);
        v = part2
          ? v % lcm
          : (v / 3) >> 0;

        const isDivisible = !(v % m.test.divisibleBy);
        const ti = m.test[isDivisible ? 'ifTrue' : 'ifFalse'];
        monkeys[ti].items.push(v);

        m.nInspected += 1;
      }
    });
  }

  monkeys.sort((a, b) => b.nInspected - a.nInspected);
  return monkeys[0].nInspected * monkeys[1].nInspected;
};

export const part1 = (input: string) => run(input);
export const part2 = (input: string) => run(input, true);
