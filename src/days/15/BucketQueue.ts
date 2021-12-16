// eslint-disable-next-line import/prefer-default-export
export class BucketQueue<Type> {
  buckets: Type[][];
  getPriority: (item: Type) => number;
  minPriority: number;
  size: number;

  constructor(buckets: number, getPriority: (item: Type) => number) {
    this.buckets = new Array(buckets).fill(null).map(() => []);
    this.getPriority = getPriority;
    this.minPriority = Number.MAX_SAFE_INTEGER;
    this.size = 0;
  }

  enqueue(item: Type) {
    const priority = this.getPriority(item);
    const bucket = this.buckets[priority];

    bucket.push(item);
    this.size += 1;

    if (priority < this.minPriority) {
      this.minPriority = priority;
    }
  }

  findMinimumNonemptyBucket(): number | null {
    if (!this.size) { return null; }
    for (let i = this.minPriority; i < this.buckets.length; i += 1) {
      if (this.buckets[i].length) {
        return i;
      }
    }

    return null;
  }

  dequeue(): Type {
    if (this.minPriority === null) {
      throw new Error('Can\'t dequeue, queue is empty');
    }

    const bucket = this.findMinimumNonemptyBucket()!;
    const next = this.buckets[bucket].pop();
    this.size -= 1;

    if (!this.buckets[bucket].length && this.size) {
      this.minPriority = this.findMinimumNonemptyBucket()!;
    }

    return next!;
  }
}
