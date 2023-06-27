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
    sorting: {},
    onSort: () => {},
    toggleExclude: () => {},
    cards: [{}],
    outputList: [
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "aback",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: false,
        type: "noun",
        word: "Aardvark",
      },
      {
        isCustomWord: false,
        isExcludedBuiltin: true,
        type: "adjective",
        word: "woozy",
      },
    ],
  },
};
