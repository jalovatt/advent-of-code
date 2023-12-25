import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1 } from '.';

const title = 'Snowverload';

const input = loadText('input.txt');

const example1 = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`;

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [
          example1,
          [['hfx', 'pzl'], ['bvb', 'cmg'], ['nvd', 'jqt']] as [string, string][],
          54,
        ],
      ])('%p => %p', (given, cuts, expected) => {
        expect(part1(given, cuts)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 507626;

      test(`${knownSolution}`, () => {
        // Cuts were determined visually by running the input through Graphviz's
        // 'neato' layout, which rendered the two halves as separate clusters
        // with only the three lines connecting them.
        const solution = part1(input, [['fht', 'vtt'], ['bbg', 'kbr'], ['czs', 'tdk']]);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
