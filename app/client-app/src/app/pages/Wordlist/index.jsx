import { WordCard } from "./components/WordCard";

//placeholder
const Wordlist = () => {
  return (
    <>
      <WordCard type={"noun"} word={"Rabbit"} isExcluded={"F"} />
      <WordCard type={"adjective"} word={"Happy"} />
      <WordCard type={"adjective"} word={"Sad"} isExcluded={"F"} />
    </>
  );
};

export default Wordlist;
