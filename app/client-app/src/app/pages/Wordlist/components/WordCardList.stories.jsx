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
    cards: [
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "adjective",
        word: "aback",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "noun",
        word: "Aardvark",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "adjective",
        word: "woozy",
      },
    ],
  },
};

export const EmptyList = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    cards: [],
  },
};

export const AllBlocked = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    cards: [
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "happy",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "noun",
        word: "rabbit",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "sad",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "noun",
        word: "cat",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "excited",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
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
    cards: [
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "adjective",
        word: "happy",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "noun",
        word: "rabbit",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "adjective",
        word: "sad",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "noun",
        word: "cat",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "adjective",
        word: "excited",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "noun",
        word: "dog",
      },
    ],
  },
};

export const MixedExcludedAndIncluded = {
  render: (args) => {
    return <WordCardList {...args} />;
  },
  args: {
    cards: [
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "happy",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "noun",
        word: "rabbit",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "sad",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "noun",
        word: "cat",
      },
    ],
  },
};
