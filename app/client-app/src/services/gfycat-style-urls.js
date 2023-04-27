/**
 * Copyright <2019> <dexo568>
 * Original package: gfycat-style-urls
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import adjectives from "./adjectives";
import animals from "./animals";

const generateGfyCatStyleUrl = (
  numAdjectives,
  delimiter,
  capitalizeFirstLetter
) => {
  let combination = "";
  const animal = animals[Math.floor(Math.random() * animals.length)];

  for (let i = 0; i < numAdjectives; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    combination += capitalizeFirstLetter
      ? adjective.charAt(0).toUpperCase() + adjective.slice(1) + delimiter
      : adjective + delimiter;
  }

  combination += capitalizeFirstLetter
    ? animal.charAt(0).toUpperCase() + animal.slice(1)
    : animal;
  return combination;
};

export default generateGfyCatStyleUrl;
