import { FetchSurveyProvider } from "app/contexts/FetchSurvey";
import { EditorBarContextProvider } from "./EditorBar";
import { PageListContextProvider } from "./PageList";

// At this time we don't have a general SurveyEditorContext
// If there's a later need it should be added here

// This wraps up all the other more specific (but still top level)
// context providers used by the editor, as well as providing their values
export const SurveyEditorContextProvider = ({
  id,
  navigate,
  selectedPageItem,
  setSelectedPageItem,
  children,
}) => {
  return (
    <FetchSurveyProvider id={id}>
      <EditorBarContextProvider navigate={navigate}>
        <PageListContextProvider
          selectedPageItem={selectedPageItem}
          setSelectedPageItem={setSelectedPageItem}
        >
          {children}
        </PageListContextProvider>
      </EditorBarContextProvider>
    </FetchSurveyProvider>
  );
};
