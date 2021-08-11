import { useState } from "react";
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
import { useDerivedState } from "hooks/useDerivedState";
import useDeferredAction from "hooks/useDeferredAction";

const PageParagraphEditor = ({
  _context: { handleParamChange },
  params,
  renderedItem,
}) => {
  const [gfmVisible, setGfmVisible] = useState(true);

  const [text, setText] = useDerivedState(params.text); // we use local state so updates work without delay
  const deferredSave = useDeferredAction(
    (value) => handleParamChange("text", value),
    1000
  );

  const handleChange = (e) => {
    setText(e.target.value);
    deferredSave(e.target.value);
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
