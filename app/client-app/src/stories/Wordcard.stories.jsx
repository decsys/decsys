import { WordCard } from "app/pages/Wordlist/components/WordCard";

export default {
  title: "Word Card",
  component: WordCard,
};

export const ExcludedNoun = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Noun",
    word: "Rabbit",
    isExcluded: false,
  },
};

export const ExcludedAdjective = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Adjective",
    word: "Energetic",
    isExcluded: false,
  },
};

export const IncludedNoun = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Noun",
    word: "Fox",
    isExcluded: true,
  },
};

export const IncludedAdjective = {
  render: (args) => {
    return <WordCard {...args} />;
  },
  args: {
    type: "Adjective",
    word: "Sad",
    isExcluded: true,
  },
};
