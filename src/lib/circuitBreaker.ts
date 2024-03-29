type AnyArgs = (...args: any[]) => void;

/**
 * Use as a failsafe when writing/debugging while loops. Will throw if the function
 * is called too many times during the same test. e.g.:
 *
 * ```
 * let thing = 0;
 * const breaker = new CircuitBreaker(1000, (innerVariable) => {
 *   console.log(`failed at thing = ${thing}`)
 * });
 *
 * while (thing < otherThing) {
 *   const innerVariable = getInnerVariable();
 *   ...stuff...
 *   breaker.tick(innerVariable);
 * }
 * ```
 *
 * In cases where the exit condition isn't known, you can avoid "unreachable code"
 * warnings with:
 * ```
 * while (!breaker.hasTripped) {
 * ```
*/
export default class CircuitBreaker {
  limit: number;
  onTrip?: AnyArgs;
  n: number;
  hasTripped: boolean;

  constructor(limit: number, onTrip?: AnyArgs) {
    this.limit = limit;
    this.onTrip = onTrip;
    this.n = 0;
    this.hasTripped = false;
  }

  tick(...args: any[]) {
    this.n += 1;
    if (this.n >= this.limit) {
      this.hasTripped = true;

      if (this.onTrip) {
        this.onTrip(...args);
      }
      throw new Error(`Tripped circuit breaker @ ${this.limit}`);
    }
  }
}
