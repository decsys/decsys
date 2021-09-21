/**
 * Pick a random item out of a list using `Math.random`
 * @param {*} array
 * @returns
 */
export const pickRandomItem = (array) => {
  const i = Math.floor(Math.random() * array.length); // random index from 0 to the max array index
  return array[i];
};

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
}

/**
 * Randomizes a list within subgroups - leaves fixed items alone.
 * @param {*} randomFlags
 * @returns
 */
export const shuffleInGroups = (randomFlags) => {
  const output = []; // we will add numbers from the input in order

  const a = Object.keys(randomFlags).reduce((a, key) => {
    if (randomFlags[key]) {
      // can randomize;
      // add to the accumulator for randomizing later
      a.push(key);
    } else {
      // can't randomize;
      // 1. randomize up to this point,
      // 2. add this fixed item,
      // 3. flush the acccumulator
      if (a.length) {
        shuffle(a); // 1
        output.push(...a); // 1b
      }
      output.push(key); // 2
      a = []; // 3
    }
    return a;
  }, []);

  // if we didn't end on a fixed item,
  // we'll need to handle whatever was left in the accumulator
  if (a.length) {
    shuffle(a); // 1
    output.push(...a); // 1b
  }

  return output;
};
