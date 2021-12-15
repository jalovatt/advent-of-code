export default (n: number, fn: () => void) => {
  for (let i = 0; i < n; i += 1) {
    fn();
  }
};
