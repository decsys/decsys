/**
 * Encode a decimal integer as follows:
 * - Add 10 so 0-9 are skipped for low numbers :) (purely visual)
 * - convert to base 35 (with the map [0-9][a-y])
 */
const encodeId = n =>
  typeof n === "number" ? (parseInt(n) + 10).toString(35) : "";

/**
 * Decode an encoded ID as follows:
 * - treat as base35 and convert to decimal
 * - take 10 off the decimal result
 *
 * @param {*} id Input ID (expect a valid base35 number)
 */
const decodeId = id => parseInt(id, 35) - 10;

/**
 * Encode a Survey ID and Instance ID pair as follows:
 * - Encode each ID by adding 10 and converting to base35 (with the map [0-9][a-y])
 * - separate them with a `z` (not used in base 35)
 * @param {*} surveyId
 * @param {*} instanceId
 * @returns the encoded ids as a string
 */
export const encode = (surveyId, instanceId) =>
  `${encodeId(surveyId)}z${encodeId(instanceId)}`;

/**
 * Decode an ID previously encoded by `encode()`
 * into its input Survey and Instance IDs.
 *
 * @param {*} id An ID previously encoded by `encode()`
 * @returns The Survey ID and Instance ID which generated the input ID.
 */
export const decode = id => id.split("z").map(x => decodeId(x));
