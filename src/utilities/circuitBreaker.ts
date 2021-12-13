let n = 0;

beforeEach(() => {
  n = 0;
});

/**
 * Use as a failsafe when writing/debugging while loops. Will throw if the function
 * is called too many times during the same test. e.g.:
 *
 * ```
 * let thing = 0;
 * while (thing < otherThing) {
 *   ...stuff...
 *   circuitBreaker(1000);
 * }
 * ```
*/
export default (limit: number) => {
  n += 1;
  if (n === limit) {
    throw new Error(`Tripped circuit breaker: ${limit}`);
  }
};
