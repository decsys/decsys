import { WordCard } from "./components/WordCard";

//placeholder
const Wordlist = () => {
  return (
    <>
      <WordCard type={"noun"} word={"Rabbit"} isExcluded={true} />
      <WordCard type={"adjective"} word={"Happy"} isExcluded={false} />
      <WordCard type={"adjective"} word={"Sad"} isExcluded={true} />
    </>
  );
};

export default Wordlist;
