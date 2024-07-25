import { listWordlist } from "api/wordlist";
import { Page } from "components/core";
import { useEffect, useState } from "react";

const Wordlists = () => {
  const [wordList, setWordList] = useState(null);

  const getWordList = async () => {
    const data = await listWordlist();
    setWordList(data);
  };

  console.log(wordList);

  return (
    <Page layout="wordlists">
      <button onClick={getWordList}>Worldlists</button>
    </Page>
  );
};

export default Wordlists;
