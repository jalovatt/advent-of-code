import { dir, log } from '../../utilities/logging';

const packetTypes: Record<number, { name: string, resolver: (values: number[]) => number }> = {
  0: {
    name: 'sum',
    resolver: (values) => values.reduce((acc, cur) => acc + cur),
  },
  1: {
    name: 'product',
    resolver: (values) => values.reduce((acc, cur) => acc * cur),
  },
  2: {
    name: 'minimum',
    resolver: (values) => values.reduce((acc, cur) => Math.min(acc, cur)),
  },
  3: {
    name: 'maximum',
    resolver: (values) => values.reduce((acc, cur) => Math.max(acc, cur)),
  },
  5: {
    name: 'greater-than',
    resolver: (values) => {
      if (values.length !== 2) {
        throw new Error(`greater-than operator got ${values.length} values`);
      }
      return values[0] > values[1] ? 1 : 0;
    },
  },
  6: {
    name: 'less-than',
    resolver: (values) => {
      if (values.length !== 2) {
        throw new Error(`less-than operator got ${values.length} values`);
      }
      return values[0] < values[1] ? 1 : 0;
    },
  },
  7: {
    name: 'equal',
    resolver: (values) => {
      if (values.length !== 2) {
        throw new Error(`equal operator got ${values.length} values`);
      }
      return values[0] === values[1] ? 1 : 0;
    },
  },
};

class Packet {
  version: number;
  type: number;
  content: string;

  value?: number;
  versionSum?: number;

  input: string;
  processedInput: string;

  childrenConsumedLength?: number;
  children: Packet[];

  lengthType?: number;
  subPacketsCount?: number;
  subPacketsLength?: number;

  remaining?: string;

  constructor(input: string, isBinary = false) {
    const raw = input.trim();
    const processedInput = isBinary
      ? raw
      : raw.split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    const [, version, type, rest] = processedInput.match(/^(\d\d\d)(\d\d\d)(\d+)/)!;

    this.version = parseInt(version, 2);
    this.type = parseInt(type, 2);

    this.input = input;
    this.processedInput = processedInput;
    this.content = rest;

    this.children = [];
    this.parseRest(rest);
  }

  parseRest(rest: string) {
    if (this.type === 4) {
      let remaining = rest;

      const literalGroups = [];
      while (remaining.length && parseInt(remaining, 2) > 0) {
        const isLast = remaining[0] === '0';
        const group = remaining.substring(1, 5);

        literalGroups.push(group);
        remaining = remaining.substring(5);

        if (isLast) { break; }
      }

      this.value = parseInt(literalGroups.join(''), 2);
      this.remaining = remaining;
      return;
    }

    this.lengthType = parseInt(rest[0], 2);

    // Next 11 bits = number of subpackets
    if (this.lengthType) {
      const numPacketBits = rest.substring(1, 12);
      this.remaining = rest.substring(12);
      this.subPacketsCount = parseInt(numPacketBits, 2);

    // Next 15 bits = total length in bits of subpackets
    } else {
      const lengthBits = rest.substring(1, 16);
      this.remaining = rest.substring(16);
      this.subPacketsLength = parseInt(lengthBits, 2);
    }

    let consumedBits = 0;

    const typeCondition = (this.lengthType)
      ? () => this.children.length < this.subPacketsCount!
      : () => consumedBits < this.subPacketsLength!;

    // eslint-disable-next-line prefer-destructuring
    let remaining = this.remaining;
    while (remaining && parseInt(remaining, 2) > 0 && typeCondition()) {
      const child = new Packet(remaining, true);
      child.childrenConsumedLength = remaining.length - (child.remaining!).length;
      consumedBits += child.childrenConsumedLength;
      remaining = child.remaining!;

      this.children.push(child);
    }

    this.value = this.resolveValue();
    this.versionSum = this.resolveVersionSum();
    this.remaining = remaining;
  }

  resolveValue(): number {
    if (this.value) { return this.value; }

    const values = this.children.map((child) => child.resolveValue());
    const resolved = packetTypes[this.type].resolver(values);

    // log(`resolver type ${this.type} => ${values} = ${value}`);
    return resolved;
  }

  resolveVersionSum(): number {
    return this.version
      + this.children.reduce((acc, cur) => acc + (cur.versionSum || cur.version), 0);
  }

  describe(): any {
    const base: any = {
      input: this.input,
      version: this.version,
      type: this.type,
      children: this.children.map((c) => c.describe()),
    };

    if (this.childrenConsumedLength) {
      base.childrenConsumedLength = this.childrenConsumedLength;
    }

    if (this.type === 4) {
      base.value = this.value;
    } else {
      base.lengthType = this.lengthType;

      if (this.lengthType) {
        base.subPacketsCount = this.subPacketsCount;
      } else {
        base.subPacketsLength = this.subPacketsLength;
      }

      base.remaining = this.remaining;
    }

    return base;
  }

  print() {
    dir(this.describe(), { depth: 4 });
  }

  describeOperation(): string {
    if (this.value) { return this.value.toString(); }

    const op = packetTypes[this.type].name;

    const childOps = this.children.map((c) => {
      const result = c.describeOperation();

      const indented = result.split('\n').map((l) => `  ${l}`).join('\n');

      return indented;
    }).join('\n');

    return `${op}\n${childOps}`;
  }

  printOperations() {
    log(this.describeOperation());
  }
}

export const testParsing = (input: string) => {
  const root = new Packet(input, true);
  return root;
};

export const a = (input: string) => {
  const root = new Packet(input);
  // root.print();
  return root.versionSum;
};

export const b = (input: string) => {
  const root = new Packet(input);
  // root.print();
  // root.printOperations();
  const result = root.value;

  return result;
};
