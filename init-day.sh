#! /bin/bash

PADDED_DAY=$(printf %02d $1)
UNPADDED_DAY=$(printf %01d $1)

DIR=./src/days/$PADDED_DAY

echo $DIR

[ -d "$DIR" ] && echo "Directory $DIR already exists" && exit

cp ./src/days/__template $DIR -r

xdg-open https://adventofcode.com/2020/day/$UNPADDED_DAY
xdg-open https://adventofcode.com/2020/day/$UNPADDED_DAY/input

yarn test days/$PADDED_DAY --watch
