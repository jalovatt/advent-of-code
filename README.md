# Advent of Code

My solutions/attempts for the annual [Advent of Code](https://adventofcode.com) coding challenge.

I won't claim to have solved all of these without assistance.

## Usage

This repo uses Yarn 2, Typescript, and Jest.

### Setup
1. Clone the repo.
2. `yarn`

#### `yarn test yyyy/dd`

Run the tests for a specific day. All the usual Jest CLI parameters apply. I would _not_ recommend running a full `yarn test` since some of the tests take a while.

#### `yarn day dd`, `yarn day yyyy dd`

Initialize the folder and files for day `dd`, of either `yyyy` or the current calendar year. Copies a template, opens that day's puzzle page and input, and starts that day's tests in watch mode.

#### `yarn test:intcode`

Run all tests related to 2019's recurring feature, [the IntCode virtual machine](https://adventofcode.com/2019/day/2), which is expanded with new instructions and operating modes over multiple days.

These solutions all import the same IntCode class, so it was useful to have the full IntCode test suite running as changes were made.

## Skipped for now

- 2018, day 22, part 2. Three rewrites and I still can't get it. :(
