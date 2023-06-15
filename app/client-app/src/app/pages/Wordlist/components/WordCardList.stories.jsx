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
    nouns: ["rabbit", "cat", "dog"],
    excludedWords: [
      {
        type: "adjective",
        word: "happy",
      },
      {
        type: "noun",
        word: "rabbit",
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
    nouns: ["rabbit", "cat", "dog"],
    excludedWords: [
      {
        type: "adjective",
        word: "happy",
      },
      {
        type: "noun",
        word: "rabbit",
      },
      {
        type: "adjective",
        word: "sad",
      },
      {
        type: "noun",
        word: "cat",
      },
      {
        type: "adjective",
        word: "excited",
      },
      {
        type: "noun",
        word: "dog",
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
    nouns: ["rabbit", "cat", "dog"],
    excludedWords: [],
  },
};

export const MismatachWordsType = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    adjectives: [],
    nouns: ["cat", "rabbit"],
    excludedWords: [
      {
        type: "adjective",
        word: "cat",
      },
      {
        type: "adjective",
        word: "rabbit",
      },
    ],
  },
};
