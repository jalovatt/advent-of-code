import { split } from '@lib/processing';

type Pattern = string[];

class ReflectionScorer {
  patterns: Pattern[];
  targetDifferences: number;

  constructor(input: string, targetDifferences: number) {
    this.patterns = split(input, '\n\n')
      .map((pattern) => pattern.split('\n'));
    this.targetDifferences = targetDifferences;
  }

  run(): number {
    let score = 0;
    for (const p of this.patterns) {
      score += this.findReflectionScore(p);
    }

    return score;
  }

  findReflectionScore(pattern: Pattern): number {
    for (let i = 1; i < pattern[0].length; i += 1) {
      if (this.compareAcrossReflection(pattern, i, true)) {
        return i;
      }
    }

    for (let i = 1; i < pattern.length; i += 1) {
      if (this.compareAcrossReflection(pattern, i, false)) {
        return 100 * i;
      }
    }

    throw new Error(`didn't find reflection in pattern:\n${pattern.join('\n')}`);
  }

  compareAcrossReflection(
    pattern: Pattern,
    index: number,
    columns: boolean,
  ): boolean {
    let differenceCount = 0;
    if (columns) {
      for (let x = 0; x < pattern[0].length - index; x += 1) {
        const forward = index + x;
        const backward = index - x - 1;

        if (forward === pattern[0].length || backward === -1) {
          break;
        }

        for (let y = 0; y < pattern.length; y += 1) {
          if (pattern[y][forward] !== pattern[y][backward]) {
            differenceCount += 1;
            if (differenceCount > this.targetDifferences) {
              return false;
            }
          }
        }
      }
    } else {
      for (let y = 0; y < pattern.length - index; y += 1) {
        const forward = index + y;
        const backward = index - y - 1;

        if (forward === pattern.length || backward === -1) {
          break;
        }

        for (let x = 0; x < pattern[0].length; x += 1) {
          if (pattern[forward][x] !== pattern[backward][x]) {
            differenceCount += 1;
            if (differenceCount > this.targetDifferences) {
              return false;
            }
          }
        }
      }
    }

    return differenceCount === this.targetDifferences;
  }
}

export const part1 = (input: string): number => new ReflectionScorer(input, 0).run();
export const part2 = (input: string): number => new ReflectionScorer(input, 1).run();
