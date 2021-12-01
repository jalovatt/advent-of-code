#! /bin/bash

PADDED_DAY=$(printf %02d $1)
UNPADDED_DAY=$(printf %01d $1)
YEAR=$(date +%Y)

DIR=./src/days/$PADDED_DAY

echo "Creating $DIR"

[ -d "$DIR" ] && echo "Directory $DIR already exists" && exit

cp -R ./src/days/__template $DIR

# Mac
if [[ $(uname) == 'Darwin' ]]; then
  CMD=open
# Linux
else
  CMD=xdg-open
fi

$("$CMD" "https://adventofcode.com/$YEAR/day/$UNPADDED_DAY")
$("$CMD" "https://adventofcode.com/$YEAR/day/$UNPADDED_DAY/input")

yarn test days/$PADDED_DAY --watch
