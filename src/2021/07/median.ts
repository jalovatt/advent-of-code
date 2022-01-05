/* eslint-disable */
// @ts-nocheck

// https://gist.github.com/wlchn/ee15de1da59b8d6981a400eee4376ea4
// Median of medians: https://en.wikipedia.org/wiki/Median_of_medians
// find median in an unsorted array, worst-case complexity O(n).
const partition = (arr, left, right, pivot, compare) => {
  let temp = arr[pivot];
  arr[pivot] = arr[right];
  arr[right] = temp;
  let track = left;
  for (let i = left; i < right; i++) {
    // if (arr[i] < arr[right]) {
    if (compare(arr[i], arr[right]) === -1) {
      let t = arr[i];
      arr[i] = arr[track];
      arr[track] = t;
      track++;
    }
  }
  temp = arr[track];
  arr[track] = arr[right];
  arr[right] = temp;
  return track;
};

const selectIdx = (arr, left, right, k, compare) => {
  if (left === right) {
    // return arr[left];
    return left;
  }
  let dest = left + k;
  while (true) {
    let pivotIndex =
      right - left + 1 <= 5
        ? Math.floor(Math.random() * (right - left + 1)) + left
        : medianOfMedians(arr, left, right, compare);
    pivotIndex = partition(arr, left, right, pivotIndex, compare);
    if (pivotIndex === dest) {
      return pivotIndex;
    } else if (pivotIndex < dest) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }
};

const medianOfMedians = (arr, left, right, compare) => {
  let numMedians = Math.ceil((right - left) / 5);
  for (let i = 0; i < numMedians; i++) {
    let subLeft = left + i * 5;
    let subRight = subLeft + 4;
    if (subRight > right) {
      subRight = right;
    }
    let medianIdx = selectIdx(arr, subLeft, subRight, Math.floor((subRight - subLeft) / 2), compare);
    let temp = arr[medianIdx];
    arr[medianIdx] = arr[left + i];
    arr[left + i] = temp;
  }
  return selectIdx(arr, left, left + numMedians - 1, Math.floor(numMedians / 2), compare);
};

const defaultCompare = (a, b) => {
  return a < b ? -1 : a > b ? 1 : 0;
};

export const selectK = (arr, k, compare = defaultCompare) => {
  if (!Array.isArray(arr) || arr.length === 0 || arr.length - 1 < k) {
    return;
  }
  if (arr.length === 1) {
    return arr[0];
  }
  let idx = selectIdx(arr, 0, arr.length - 1, k, compare);
  return arr[idx];
};

export const selectMedian = (arr, compare = defaultCompare) => {
  return selectK(arr, Math.floor(arr.length / 2), compare);
};
