import describeDay from '@lib/describeDay';
import loadText from '@lib/loadText';
import { part1, part2 } from '.';

const title = 'No title yet';

const input = loadText('input.txt');

const example1 = '{"e": 86,"c": 23,"a":{"a":[120,169,"green","red","orange"],"b":"red"},"g": "yellow","b":["yellow"],"d":"red","f":-19}';
const example2 = '{"e":-47,"a":[2],"d":{"a":"violet"},"c":"green","h":"orange","b":{"e":59,"a":"yellow","d":"green","c":47,"h":"red","b":"blue","g":"orange","f":["violet",43,168,78]},"g":"orange","f":[{"e":[82,-41,2,"red","violet","orange","yellow"],"c":"green","a":77,"g":"orange","b":147,"d":49,"f":"blue"},-1,142,136,["green","red",166,-21],"blue","orange",{"a":38}]},';

const exampleE = '[[{"e":86,"c":23,"a":{"a":[120,169,"green","red","orange"],"b":"red"},"g":"yellow","b":["yellow"],"d":"red","f":-19},{"e":-47,"a":[2],"d":{"a":"violet"},"c":"green","h":"orange","b":{"e":59,"a":"yellow","d":"green","c":47,"h":"red","b":"blue","g":"orange","f":["violet",43,168,78]},"g":"orange","f":[{"e":[82,-41,2,"red","violet","orange","yellow"],"c":"green","a":77,"g":"orange","b":147,"d":49,"f":"blue"},-1,142,136,["green","red",166,-21],"blue","orange",{"a":38}]},"orange","yellow"],"green",-22,[37,[4,-40,["red","yellow",["yellow",177,"red","blue",139,[55,13,"yellow","violet",-21,140,"yellow",117],"blue","blue",106],"blue",{"a":23}],183,92,"orange","green"],"orange"],-5]';
const strippedE = '[[{"e":-47,"a":[2],"d":{"a":"violet"},"c":"green","h":"orange","g":"orange","f":[{"e":[82,-41,2,"red","violet","orange","yellow"],"c":"green","a":77,"g":"orange","b":147,"d":49,"f":"blue"},-1,142,136,["green","red",166,-21],"blue","orange",{"a":38}]},"orange","yellow"],"green",-22,[37,[4,-40,["red","yellow",["yellow",177,"red","blue",139,[55,13,"yellow","violet",-21,140,"yellow",117],"blue","blue",106],"blue",{"a":23}],183,92,"orange","green"],"orange"],-5]';

const exampleA = '"a":{"c":["green",["red","orange",{"e":-28,"a":{"a":"violet","b":110},"d":[[174,140,72],191,"yellow",108,195,{"a":"violet"},147,53],"c":"yellow","h":"green","b":"violet","g":"red","f":["blue","orange","violet",[48,118],156,144,-46,110,["orange","yellow","blue","red"],149],"i":{"e":"orange","c":101,"a":{"e":111,"a":"blue","d":"orange","j":"orange","c":-40,"h":13,"b":"orange","g":"yellow","f":32,"i":"yellow"},"g":{"e":"orange","a":"blue","d":195,"j":81,"c":185,"h":20,"b":4,"g":"green","f":112,"i":147},"b":-22,"d":199,"f":"yellow"}},"yellow",19,128,-3,27,["orange",{"e":-8,"c":156,"a":"yellow","b":"red","d":20,"f":-37},[{"c":19,"a":"blue","b":150},"orange",-12,9]]],[12,{"e":"blue","c":162,"a":["blue",184,"yellow","orange",{"a":"yellow","b":"green"},88,-19,60,"yellow"],"g":"yellow","b":191,"d":-6,"f":"violet"}],{"c":"yellow","a":"orange","b":{"a":"violet","b":["orange","orange","violet",{"e":"red","a":"red","d":163,"c":153,"h":"green","b":6,"g":"blue","f":17,"i":63},163,[164,-41,"violet","violet",126]]},"d":-38}],"a":{"e":{"c":-1,"a":"orange","b":{"c":131,"a":{"e":-11,"c":120,"a":"green","b":198,"d":152,"f":37},"b":77,"d":{"e":8,"a":21,"d":"blue","c":"yellow","h":"violet","b":11,"g":"violet","f":{"e":148,"c":98,"a":80,"b":78,"d":68}}},"d":"orange"},"a":["violet",[-30,117],[78,31],74,197,"red","orange",95],"d":"green","c":[96,"violet"],"h":{"e":{"c":"green","a":[76,16,125,"green",15,"violet",130,60,"red"],"b":"orange","d":-38},"a":71,"d":158,"j":-16,"c":[["yellow","green",183,165,-28,4,102],-20,"blue","violet",{"e":"yellow","c":{"e":"orange","a":"yellow","d":"red","c":"orange","h":"orange","b":169,"g":"violet","f":48},"a":99,"b":["blue",-1,"blue"],"d":104,"f":20},83],"h":"green","b":[-14,[28],"yellow",[93,"blue",-24,160,35,25,-32,"green"],{"e":[51,"red",64,"red","blue",-16,31,146,"blue","yellow"],"c":122,"a":"orange","b":"yellow","d":{"c":53,"a":179,"b":"blue","d":-44}},17,110],"g":151,"f":"orange","i":{"a":"violet","b":{"a":[-24]}}},"b":["violet",{"e":{"e":91,"a":{"e":"blue","a":-25,"d":70,"c":"green","h":"violet","b":48,"g":"violet","f":"orange"},"d":"yellow","c":136,"h":90,"b":{"e":26,"c":"green","a":"blue","g":"violet","b":192,"d":198,"f":86},"g":"orange","f":"blue"},"a":137,"d":47,"c":11,"h":"yellow","b":"orange","g":"orange","f":{"e":"blue","a":45,"d":"violet","j":146,"c":-38,"h":4,"b":157,"g":104,"f":-13,"i":"yellow"}},{"e":191,"a":"blue","d":"green","c":"blue","h":-19,"b":148,"g":"blue","f":{"e":57,"c":"red","a":167,"b":[-42,147,166,74,-32,"orange","violet","yellow"],"d":"green","f":71}},"green",[184,"yellow",[["yellow","yellow"],"green",{"e":-24,"a":1,"d":44,"c":"yellow","h":"yellow","b":144,"g":"violet","f":"green","i":-7},86,119,52,"orange",["red","red",18,"orange",192,116],120,109]],["violet",-14,"violet",{"e":-29,"c":{"e":"green","a":"red","d":"blue","j":68,"c":9,"h":"orange","b":25,"g":"red","f":10,"i":"green"},"a":-15,"b":"blue","d":"violet","f":125},119,[127,"violet","green",39]]],"g":"green","f":-14},"b":23,"d":{"c":{"c":98,"a":"yellow","b":97},"a":-29,"b":{"a":192,"b":["violet","yellow",65,{"c":{"e":"violet","c":"yellow","a":"violet","b":"blue","d":"orange"},"a":"red","b":176},192]},"d":"orange"}},';
const strippedA = '"a":{"c":["green",["red","orange","yellow",19,128,-3,27,["orange",[{"c":19,"a":"blue","b":150},"orange",-12,9]]],[12,{"e":"blue","c":162,"a":["blue",184,"yellow","orange",{"a":"yellow","b":"green"},88,-19,60,"yellow"],"g":"yellow","b":191,"d":-6,"f":"violet"}],{"c":"yellow","a":"orange","b":{"a":"violet","b":["orange","orange","violet",163,[164,-41,"violet","violet",126]]},"d":-38}],"a":{"e":{"c":-1,"a":"orange","b":{"c":131,"a":{"e":-11,"c":120,"a":"green","b":198,"d":152,"f":37},"b":77,"d":{"e":8,"a":21,"d":"blue","c":"yellow","h":"violet","b":11,"g":"violet","f":{"e":148,"c":98,"a":80,"b":78,"d":68}}},"d":"orange"},"a":["violet",[-30,117],[78,31],74,197,"red","orange",95],"d":"green","c":[96,"violet"],"h":{"e":{"c":"green","a":[76,16,125,"green",15,"violet",130,60,"red"],"b":"orange","d":-38},"a":71,"d":158,"j":-16,"c":[["yellow","green",183,165,-28,4,102],-20,"blue","violet",{"e":"yellow","a":99,"b":["blue",-1,"blue"],"d":104,"f":20},83],"h":"green","b":[-14,[28],"yellow",[93,"blue",-24,160,35,25,-32,"green"],{"e":[51,"red",64,"red","blue",-16,31,146,"blue","yellow"],"c":122,"a":"orange","b":"yellow","d":{"c":53,"a":179,"b":"blue","d":-44}},17,110],"g":151,"f":"orange","i":{"a":"violet","b":{"a":[-24]}}},"b":["violet",{"e":{"e":91,"a":{"e":"blue","a":-25,"d":70,"c":"green","h":"violet","b":48,"g":"violet","f":"orange"},"d":"yellow","c":136,"h":90,"b":{"e":26,"c":"green","a":"blue","g":"violet","b":192,"d":198,"f":86},"g":"orange","f":"blue"},"a":137,"d":47,"c":11,"h":"yellow","b":"orange","g":"orange","f":{"e":"blue","a":45,"d":"violet","j":146,"c":-38,"h":4,"b":157,"g":104,"f":-13,"i":"yellow"}},{"e":191,"a":"blue","d":"green","c":"blue","h":-19,"b":148,"g":"blue",},"green",[184,"yellow",[["yellow","yellow"],"green",{"e":-24,"a":1,"d":44,"c":"yellow","h":"yellow","b":144,"g":"violet","f":"green","i":-7},86,119,52,"orange",["red","red",18,"orange",192,116],120,109]],["violet",-14,"violet",{"e":-29,"a":-15,"b":"blue","d":"violet","f":125},119,[127,"violet","green",39]]],"g":"green","f":-14},"b":23,"d":{"c":{"c":98,"a":"yellow","b":97},"a":-29,"b":{"a":192,"b":["violet","yellow",65,192]},"d":"orange"}},';

const exampleB = '"b":[{"e":"yellow","c":45,"a":81,"b":["orange"],"d":"violet","f":[-3,"red",146,186,"orange","red","blue",{"e":"green","c":22,"a":"yellow","b":"blue","d":-2,"f":"green"},0,180]},[[-36,["orange",[166],"violet"],{"c":86,"a":[2,173,78,"violet","orange",["violet","yellow","blue",107,24,-1,"orange",13,"green","violet"]],"b":"violet","d":107},100,["yellow",-22,[177,69,144,84,159,"violet"],"green"],{"e":"green","a":78,"d":173,"c":"blue","h":36,"b":[[-48,164,"red","blue",45],["green","orange",23,15,110,49,"blue"],"violet",0,192,53],"g":["blue","violet"],"f":"orange","i":[{"e":186,"c":"orange","a":"green","b":174,"d":"yellow","f":46},"violet",188,"yellow",54,-6,"blue","violet",0,{"e":166,"a":"yellow","d":"red","j":"blue","c":"red","h":97,"b":"violet","g":32,"f":173,"i":95}]},{"a":58,"b":"blue"},"green",["red",150,3,"orange",32,106,[["blue"],118,{"c":178,"a":7,"b":185,"d":"violet"},"red",164,"red",[128,"red"],-44],{"e":"orange","a":"orange","d":130,"c":"yellow","h":"yellow","b":{"e":91,"a":161,"d":-44,"c":-45,"h":"blue","b":"orange","g":122,"f":"orange"},"g":"yellow","f":"blue"},139,{"a":97}]],"orange",["orange",0,"blue","red",{"e":192,"c":92,"a":{"a":["red",164,"yellow",189,"blue",150,"green","violet",-35,33],"b":"red"},"g":"yellow","b":{"a":"blue"},"d":"red","f":-31},111,"yellow","red",[["green","green",42,-47,[88,142,"blue",59,-42,"violet"],"green"],"orange",["violet","yellow","violet",198,94,44,"orange","green","blue",26],"blue","violet"]],{"a":118}],{"e":-35,"a":{"e":["orange",-1,121,"red"],"c":"violet","a":[[127,-18,-4,[-40,42,"violet",167,"orange",112,"orange"],30,31,"violet",37],{"c":"blue","a":"green","b":172},[141,154],146,"yellow"],"b":"blue","d":-3},"d":"red","c":-17,"h":-3,"b":["violet","yellow",19,"red",8,138,37],"g":{"c":{"e":-5,"c":[-23,21,"green",-3,"red"],"a":163,"b":"blue","d":"red","f":["violet",136,"violet"]},"a":183,"b":-36,"d":"violet"},"f":["green",["green",{"e":"red","c":"yellow","a":10,"g":"blue","b":56,"d":"red","f":["green","red","red"]},["violet","orange",{"e":7,"c":170,"a":"green","b":55,"d":115},"green","blue"]]]},{"e":{"e":{"a":"blue","b":[192,"blue",86,93]},"a":"green","d":"yellow","c":186,"h":["violet","orange","orange","violet","red","orange",139,"violet","green",{"e":"red","a":85,"d":"orange","c":"yellow","h":[46,35,"red","green",-11,"blue"],"b":"yellow","g":"yellow","f":"orange"}],"b":{"e":77,"a":"yellow","d":"green","c":144,"h":"green","b":{"e":[27,"blue","yellow",-48,-21,-12,121,"violet"],"a":[-23],"d":"blue","j":{"e":"orange","c":"blue","a":"green","b":-34,"d":"green"},"c":"green","h":"green","b":61,"g":["blue"],"f":19,"i":"violet"},"g":86,"f":"orange"},"g":"yellow","f":"orange"},"c":{"c":["yellow",82,"red","orange",{"e":34,"c":"green","a":"violet","b":182,"d":"orange","f":{"e":-49,"a":184,"d":57,"j":"yellow","c":120,"h":"violet","b":170,"g":159,"f":-3,"i":99}},-37,{"e":84,"a":["violet",154,"violet",123,"violet",148,105,"yellow",195],"d":"orange","c":{"a":140},"h":"yellow","b":159,"g":76,"f":186},183],"a":[{"e":"yellow","a":-2,"d":"green","c":{"c":68,"a":"red","b":"blue"},"h":[140,99,-2,"green","orange","orange",-14,60,"red","green"],"b":"violet","g":1,"f":["yellow","violet"],"i":142},{"e":{"a":76,"b":-17},"c":46,"a":[76,1,79,36,-25,"yellow",0],"g":"yellow","b":185,"d":54,"f":"green"}],"b":{"e":127,"a":[["violet"],115,114,"red","orange",83,-17,-2],"d":{"e":198,"c":"red","a":46,"b":77,"d":"green"},"c":140,"h":"orange","b":89,"g":149,"f":"orange"}},"a":"blue","g":62,"b":"orange","d":"violet","f":{"e":-11,"a":[29,"yellow","yellow",187,"orange",{"e":147,"a":197,"d":["green",182,-2,95,-8,110,-38],"c":"violet","h":187,"b":90,"g":22,"f":"yellow","i":"green"},{"a":["blue","red",140],"b":"violet"},"blue",76,59],"d":-26,"c":[{"a":"orange","b":179},"red",{"e":"violet","c":"orange","a":"blue","g":"violet","b":25,"d":149,"f":-27},{"e":"green","a":"yellow","d":"violet","j":{"c":67,"a":179,"b":53},"c":145,"h":-4,"b":"blue","g":11,"f":"blue","i":"violet"}],"h":"red","b":"blue","g":{"e":"yellow","c":[93,12,118,-7,125,93,"yellow",182,113,"yellow"],"a":"green","b":"green","d":"violet"},"f":"green","i":"green"}},[7]],';
const strippedB = '"b":[{"e":"yellow","c":45,"a":81,"b":["orange"],"d":"violet","f":[-3,"red",146,186,"orange","red","blue",{"e":"green","c":22,"a":"yellow","b":"blue","d":-2,"f":"green"},0,180]},[[-36,["orange",[166],"violet"],{"c":86,"a":[2,173,78,"violet","orange",["violet","yellow","blue",107,24,-1,"orange",13,"green","violet"]],"b":"violet","d":107},100,["yellow",-22,[177,69,144,84,159,"violet"],"green"],{"e":"green","a":78,"d":173,"c":"blue","h":36,"b":[[-48,164,"red","blue",45],["green","orange",23,15,110,49,"blue"],"violet",0,192,53],"g":["blue","violet"],"f":"orange","i":[{"e":186,"c":"orange","a":"green","b":174,"d":"yellow","f":46},"violet",188,"yellow",54,-6,"blue","violet",0,]},{"a":58,"b":"blue"},"green",["red",150,3,"orange",32,106,[["blue"],118,{"c":178,"a":7,"b":185,"d":"violet"},"red",164,"red",[128,"red"],-44],{"e":"orange","a":"orange","d":130,"c":"yellow","h":"yellow","b":{"e":91,"a":161,"d":-44,"c":-45,"h":"blue","b":"orange","g":122,"f":"orange"},"g":"yellow","f":"blue"},139,{"a":97}]],"orange",["orange",0,"blue","red",111,"yellow","red",[["green","green",42,-47,[88,142,"blue",59,-42,"violet"],"green"],"orange",["violet","yellow","violet",198,94,44,"orange","green","blue",26],"blue","violet"]],{"a":118}],{"e":{"e":{"a":"blue","b":[192,"blue",86,93]},"a":"green","d":"yellow","c":186,"h":["violet","orange","orange","violet","red","orange",139,"violet","green",],"b":{"e":77,"a":"yellow","d":"green","c":144,"h":"green","b":{"e":[27,"blue","yellow",-48,-21,-12,121,"violet"],"a":[-23],"d":"blue","j":{"e":"orange","c":"blue","a":"green","b":-34,"d":"green"},"c":"green","h":"green","b":61,"g":["blue"],"f":19,"i":"violet"},"g":86,"f":"orange"},"g":"yellow","f":"orange"},"c":{"c":["yellow",82,"red","orange",{"e":34,"c":"green","a":"violet","b":182,"d":"orange","f":{"e":-49,"a":184,"d":57,"j":"yellow","c":120,"h":"violet","b":170,"g":159,"f":-3,"i":99}},-37,{"e":84,"a":["violet",154,"violet",123,"violet",148,105,"yellow",195],"d":"orange","c":{"a":140},"h":"yellow","b":159,"g":76,"f":186},183],"a":[{"e":"yellow","a":-2,"d":"green","h":[140,99,-2,"green","orange","orange",-14,60,"red","green"],"b":"violet","g":1,"f":["yellow","violet"],"i":142},{"e":{"a":76,"b":-17},"c":46,"a":[76,1,79,36,-25,"yellow",0],"g":"yellow","b":185,"d":54,"f":"green"}],"b":{"e":127,"a":[["violet"],115,114,"red","orange",83,-17,-2],"c":140,"h":"orange","b":89,"g":149,"f":"orange"}},"a":"blue","g":62,"b":"orange","d":"violet",},[7]],';

describeDay(title, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['[1,2,3]', 6],
        ['{"a":2,"b":4}', 6],
        ['[[[3]]]', 3],
        ['{"a":{"b":4},"c":-1}', 3],
        ['{"a":[-1,1]}', 0],
        ['[-1,{"a":1}]', 0],
        ['[]', 0],
        ['{}', 0],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 111754;

      test(`${knownSolution}`, () => {
        const solution = part1(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['[1,2,3]', 6],
        ['[1,{"c":"red","b":2},3]', 4],
        ['{"d":"red","e":[1,2,3,4],"f":5}', 0],
        ['[1,"red",5]', 6],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });

      test.each([
        [example1, 0],
        [example2, 731],
        [exampleE, strippedE],
        [exampleA, strippedA],
        [exampleB, strippedB],
      ])('example => stripped %#', (given, expected) => {
        expect(part2(given)).toEqual(typeof expected === 'string' ? part2(expected) : expected);
      });
    });

    describe('Solution', () => {
      const knownSolution = 65402;

      test(`${knownSolution}`, () => {
        const solution = part2(input);

        expect(solution).toEqual(knownSolution);
      });
    });
  });
});
