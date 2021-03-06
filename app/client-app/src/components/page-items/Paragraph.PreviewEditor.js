import { useState, useEffect } from "react";
import {
  Icon,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaInfoCircle, FaExternalLinkAlt } from "react-icons/fa";

const PageParagraphEditor = ({
  _context: { handleParamChange },
  params,
  renderedItem,
}) => {
  const [gfmVisible, setGfmVisible] = useState(true);

  const [timer, setTimer] = useState();

  const [text, setText] = useState(params.text); // we use local state so updates work without delay
  useEffect(() => setText(params.text), [params]); // but still ensure update when new name props come in

  const handleChange = (e) => {
    setText(e.target.value); //update local state
    e.persist(); // tell React we want the event to have a longer lifetime than this scope
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => handleParamChange("text", e.target.value), 1000));
    // TODO: read about debouncing
  };
  return (
    <Tabs onChange={(i) => setGfmVisible(!i)}>
      <TabList>
        <Tab>Edit</Tab>
        <Tab>Preview</Tab>
        <Stack direction="row" align="center" hidden={!gfmVisible}>
          <Icon as={FaInfoCircle} />
          <Text>Paragraphs support</Text>
          <Link
            isExternal
            href="https://github.github.com/gfm/"
            color="blue.500"
          >
            Github Flavoured Markdown
            <sup>
              <Icon ml={1} as={FaExternalLinkAlt} />
            </sup>
          </Link>
        </Stack>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Textarea rows="8" value={text} onChange={handleChange} />
        </TabPanel>
        <TabPanel>{renderedItem}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default PageParagraphEditor;
