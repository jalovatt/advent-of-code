type MoveChar = '>' | '<' | '^' | 'v';
type BinaryChar = 1 | 0;

// [y, x]
const moves: Record<MoveChar, [number, number]> = {
  '>': [0, 1],
  '<': [0, -1],
  '^': [-1, 0],
  v: [1, 0],
};

export const part1 = (input: string): number => {
  const visited: Set<string> = new Set(['0,0']);

  let y = 0;
  let x = 0;

  for (let i = 0; i < input.length; i += 1) {
    const move = moves[input[i] as MoveChar];

    y += move[0];
    x += move[1];

    const k = `${y},${x}`;

    if (!visited.has(k)) {
      visited.add(k);
    }
  }

  return visited.size;
};

export const part2 = (input: string): number => {
  const visited: Set<string> = new Set(['0,0']);

  const positions: Record<BinaryChar, { y: number, x: number }> = {
    0: { y: 0, x: 0 },
    1: { y: 0, x: 0 },
  };

  for (let i = 0; i < input.length; i += 1) {
    const move = moves[input[i] as MoveChar];

    const mover = (i & 1) as BinaryChar;

    positions[mover].y += move[0];
    positions[mover].x += move[1];

    const k = `${positions[mover].y},${positions[mover].x}`;

    if (!visited.has(k)) {
      visited.add(k);
    }
  }

  return visited.size;
};
