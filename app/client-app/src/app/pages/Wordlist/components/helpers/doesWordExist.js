import adjectives from "services/adjectives";
import animals from "services/animals";

export const wordExists = (word) => {
  const result = adjectives.includes(word) || animals.includes(word);
  return result;
};
