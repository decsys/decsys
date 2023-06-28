import { WordCard } from "app/pages/Wordlist/components/WordCard";

export default {
  title: "Word Card",
  component: WordCard,
};

export const IncludedNoun = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Noun",
    word: "Rabbit",
    isExcludedBuiltin: false,
  },
};

export const IncludedAdjective = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Adjective",
    word: "Energetic",
    isExcludedBuiltin: false,
  },
};

export const ExcludedNoun = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Noun",
    word: "Fox",
    isExcludedBuiltin: true,
  },
};

export const ExcludedAdjective = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Adjective",
    word: "Sad",
    isExcludedBuiltin: true,
  },
};
