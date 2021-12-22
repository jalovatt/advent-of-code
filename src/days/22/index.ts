import { dir, log, time } from '../../utilities/logging';
import { split } from '../../utilities/processing';

type Region3 = {
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  z1: number,
  z2: number,
};

interface Instruction extends Region3 {
  state: 0 | 1,
}

class Field {
  zMap: Map<bigint, Map<bigint, number>>;

  constructor() {
    this.zMap = new Map();
  }

  set(z: bigint, k: bigint, v: number) {
    let m;
    if (!this.zMap.has(z)) {
      m = new Map();

      this.zMap.set(z, m);
    } else {
      m = this.zMap.get(z)!;
    }

    m!.set(k, v);
  }

  get(z: bigint, k: bigint) {
    return this.zMap.get(z)?.get(k) ?? 0;
  }

  * [Symbol.iterator]() {
    for (const z of this.zMap.values()) {
      for (const v of z.values()) {
        yield v;
      }
    }
  }
}

const intPattern = '[-0123456789]+';
const lineExp = new RegExp(`(\\w+) x=(${intPattern})..(${intPattern}),y=(${intPattern})..(${intPattern}),z=(${intPattern})..(${intPattern})`);

export const parseLine = (line: string): Instruction => {
  const matched = line.match(lineExp)!;
  const [, state, x1, x2, y1, y2, z1, z2] = matched;

  return {
    state: state === 'on' ? 1 : 0,
    x1: parseInt(x1, 10),
    x2: parseInt(x2, 10),
    y1: parseInt(y1, 10),
    y2: parseInt(y2, 10),
    z1: parseInt(z1, 10),
    z2: parseInt(z2, 10),
  };
};

// eslint-disable-next-line no-bitwise
const getKey = (x: bigint, y: bigint): bigint => (x << 17n) + y;

const updateField = (instruction: Instruction, field: Field, bounds?: Region3) => {
  const xMin = BigInt(bounds ? Math.max(bounds.x1, instruction.x1) : instruction.x1);
  const xMax = BigInt(bounds ? Math.min(bounds.x2, instruction.x2) : instruction.x2);
  const yMin = BigInt(bounds ? Math.max(bounds.y1, instruction.y1) : instruction.y1);
  const yMax = BigInt(bounds ? Math.min(bounds.y2, instruction.y2) : instruction.y2);
  const zMin = BigInt(bounds ? Math.max(bounds.z1, instruction.z1) : instruction.z1);
  const zMax = BigInt(bounds ? Math.min(bounds.z2, instruction.z2) : instruction.z2);

  for (let x = xMin; x <= xMax; x += 1n) {
    for (let y = yMin; y <= yMax; y += 1n) {
      for (let z = zMin; z <= zMax; z += 1n) {
        const k = getKey(x, y);

        try {
          field.set(z, k, instruction.state);
        } catch (err) {
          throw new Error(`Unable to set key '${k}' (${x}, ${y}, ${z})\n${err}`);
        }
      }
    }
  }
};

const countField = (field: Field): number => {
  // if (!bounds) {
  let count = 0;
  for (const v of field) {
    count += v;
  }

  return count;
};

const aBounds: Region3 = {
  x1: -50,
  x2: 50,
  y1: -50,
  y2: 50,
  z1: -50,
  z2: 50,
};

export const a = (input: string) => {
  const instructions = split(input).map(parseLine);

  const field = new Field();

  for (let i = 0; i < instructions.length; i += 1) {
    updateField(instructions[i], field, aBounds);
  }

  return countField(field);
};

export const b = (input: string) => {
  const instructions = split(input).map(parseLine);

  const field = new Field();

  for (let i = 0; i < instructions.length; i += 1) {
    time(`${i} of ${instructions.length}`);
    updateField(instructions[i], field);
    time(`${i} of ${instructions.length}`, true);
  }

  return countField(field);
};
