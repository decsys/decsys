/**
 * Copyright <2019> <dexo568>
 * Original package: gfycat-style-urls
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import adjectives from "./adjectives";
import animals from "./animals";
import { toDictionary } from "./data-structures";

const generateGfyCatStyleUrl = (
  excludedBuiltins,
  numAdjectives,
  delimiter,
  capitalizeFirstLetter
) => {
  let combination = "";

  const excludedBuitinWords = toDictionary(excludedBuiltins, "word");

  // Filter adjectives array
  const filteredAdjectives = adjectives.filter(
    (adjective) => !excludedBuitinWords[adjective]
  );
  const filteredNouns = animals.filter((noun) => !excludedBuitinWords[noun]);

  for (let i = 0; i < numAdjectives; i++) {
    const adjective =
      filteredAdjectives[Math.floor(Math.random() * filteredAdjectives.length)];

    combination += capitalizeFirstLetter
      ? adjective.charAt(0).toUpperCase() + adjective.slice(1) + delimiter
      : adjective + delimiter;
  }

  const noun = filteredNouns[Math.floor(Math.random() * filteredNouns.length)];
  combination += capitalizeFirstLetter
    ? noun.charAt(0).toUpperCase() + noun.slice(1)
    : noun;

  return combination;
};

export default generateGfyCatStyleUrl;
