/**
 * Pretty-printing to add the year and day to spec titles
 */
export default (title: string, fn: () => void) => {
  const caller = new Error()!.stack!.split('\n')[2];
  const [, day, year] = caller.split('/').reverse();

  describe(`${year} - ${day}: ${title}`, fn);
};
