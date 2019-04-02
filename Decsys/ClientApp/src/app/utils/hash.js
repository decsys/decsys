// base64 charmap
const map = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split(
  ""
);

/**
 * Convert a decimal integer to a URL friendly base64 number integer
 */
export const decTo64 = n => {
  const base = 64;

  const ns = asIntegerString(n);

  let result = "";
  const convert = n => {
    if (n === 0) return;
    result = map[Math.abs(n) % base] + result;
    return convert(parseInt(n / base, 10));
  };
  convert(ns);

  return n < 0 ? "-" + result : result;
};

const asIntegerString = n => {
  if (typeof n === "string") n = parseFloat(n);
  if (typeof n !== "number") throw new TypeError("Expected an integer.");

  const ns = n.toString();
  if (ns.indexOf(".") >= 0) throw new TypeError("Expected an integer.");

  return ns;
};

/**
 * Convert a URL friendly base64 integer value to a decimal integer
 * @param {*} n
 */
export const decFrom64 = n => {
  const base = 64;

  const ns = n.split("");
  let result = 0;

  // here i functions as both the power, and the offset from the right of the number
  for (let i = 0; i < ns.length; i++) {
    result += map.indexOf(ns[ns.length - 1 - i]) * Math.pow(base, i);
  }

  return result;
};

/**
 * Convert an integer from one base to another.
 * Base (radix) may range from 2 - 36,
 * since this just wraps JS's built-in conversions
 * @param {*} n input value
 * @param {*} from input base (2 - 36)
 * @param {*} to output base (2 - 36)
 */
export const baseConvert = (n, from, to) => parseInt(n, from).toString(to);

/**
 * Hash an IPv4 address so that:
 * 1. it doesn't look like an IP Address
 * 2. It's slightly shorter
 *
 * Process:
 * 1. Convert all the IPv4 octets to numeric URL-friendly base64
 *   - `255.255.255.255` -> `3_.3_.3_.3_`
 * 2. use a 4bit mask header (1 char in hex) to flag whether an octet takes 2 chars or only 1 in base64
 *   - if the flags are all off (0) you may drop the 4bit header
 *   - `0.0.0.0` -> `0.0.0.0` (converted octets) -> flag `0` so no header
 *   - `255.255.255.255` -> `3_.3_.3_.3_` -> flag `1111` (`f` in hex)
 * 3. remove the octet separators and combine the header and the base64 payload
 *   - `0.0.0.0` -> `0000` - 4 chars vs 7
 *   - `255.255.255.255` -> `f3_3_3_3_` - 9 chars vs 15
 * @param {*} ip
 */
export const ipEncode = ip => {
  const octets = ip.split(".");
  if (octets.length !== 4)
    throw new Error("expected an IPv4 address in the format x.x.x.x");
  const flags = [];
  const octets64 = octets.map(x => {
    const o = decTo64(x);
    flags.push(o.split("").length === 2 ? 1 : 0);
    return o;
  });

  const hexFlags = baseConvert(flags.join(""), 2, 16);

  // only add the hex flags header if it's not 0
  return (hexFlags !== "0" ? hexFlags : "") + octets64.join("");
};

/**
 * Decode an IPv4 address as encoded
 * by the corresponding ipEncode() function
 * @param {*} hash an encoded hash of an ipv4 address
 */
export const ipDecode = hash => {
  if (hash.length < 4)
    throw new Error("minimum valid IP address hash length is 4 characters");

  // grab the first char as the flags header
  // do this first so we can destructure <3
  let [flags, ...address] = hash.split("");

  // now check the length to see if we actually have a header
  if (hash.length === 4) {
    // no header char
    address = [flags, ...address]; // restructure the address
    flags = "0000"; // set binary flags to 0
  } else {
    // header char is present, so parse it to a 4 bit binary string
    flags = baseConvert(flags, 16, 2)
      .padStart(4, "0")
      .split("");
  }

  let octets = [];
  let cursor = 0;
  for (let i = 0; i < flags.length; i++) {
    let octet = address[cursor++];
    if (parseInt(flags[i])) octet += address[cursor++];
    octets.push(decFrom64(octet.toString()));
  }

  return octets.join(".");
};
