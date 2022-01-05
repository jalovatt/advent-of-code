const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const d = new Date();

const [,, ...args] = process.argv;

let year = d.getFullYear();
let day = d.getDate().toString(10);

if (args.length === 1) {
  day = args[0];
} else if (args.length === 2) {
  year = parseInt(args[0], 10);
  if (year < 100) {
    year += 2000;
  }
  day = args[1];
}

const paddedDay = day.padStart(2, '0');

const dayPath = path.resolve(__dirname, `src/${year}/${paddedDay}`);
const templatePath = path.resolve(__dirname, 'src/__template/day');
if (fs.existsSync(dayPath)) {
  // eslint-disable-next-line no-console
  console.log(`Directory ${dayPath} already exists; exiting`);
  return null;
}

// eslint-disable-next-line no-console
console.log(`Creating ${dayPath}`);
fs.mkdirSync(dayPath, { recursive: true });
childProcess.execSync(`cp -R ${templatePath}/* ${dayPath}`);

const cmd = (process.platform === 'darwin' ? 'open' : 'xdg-open');
const dayUrl = `https://adventofcode.com/${year}/day/${day}`;
childProcess.exec(`${cmd} ${dayUrl}`);
childProcess.exec(`${cmd} ${dayUrl}/input`);

return childProcess.execSync(`yarn test ${year}/${paddedDay} --watch`, { cwd: __dirname, stdio: 'inherit' });
