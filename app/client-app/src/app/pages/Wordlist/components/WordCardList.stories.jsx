import { WordCardList } from "./WordCardList";

export default {
  title: "Word Card List",
  component: WordCardList,
};

export const Basic = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    adjectives: ["happy", "sad", "excited"],
    nouns: ["apple", "car", "house"],
    excludedWords: [
      {
        type: "adjective",
        word: "happy",
      },
      {
        type: "noun",
        word: "apple",
      },
    ],
  },
};

export const AllBlocked = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    adjectives: ["happy", "sad", "excited"],
    nouns: ["apple", "car", "house"],
    excludedWords: [
      {
        type: "adjective",
        word: "happy",
      },
      {
        type: "noun",
        word: "apple",
      },
      {
        type: "adjective",
        word: "sad",
      },
      {
        type: "noun",
        word: "car",
      },
      {
        type: "adjective",
        word: "excited",
      },
      {
        type: "noun",
        word: "house",
      },
    ],
  },
};

export const AllUnblocked = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    adjectives: ["happy", "sad", "excited"],
    nouns: ["apple", "car", "house"],
    excludedWords: [],
  },
};

export const MismatachWordsType = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    adjectives: [],
    nouns: ["cherry", "banana"],
    excludedWords: [
      {
        type: "adjective",
        word: "cherry",
      },
      {
        type: "adjective",
        word: "banana",
      },
    ],
  },
};
