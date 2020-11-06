import { createElement } from "react";
import ParamsEditor from "./ParamsEditor";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { usePageListContext } from "../../contexts/PageList";
import { getComponent } from "services/page-items";
import pageItemActions from "../../actions/pageItemActions";
import { Flex } from "@chakra-ui/react";

// TODO: Document this capability for components
// with the api (props signature, _context etc...)
const PageItemCustomParamsEditor = ({
  surveyId,
  pageId,
  itemId,
  renderComponent,
  params,
  handleParamChange,
}) => {
  const paramsEditorContext = {
    itemId,
    pageId,
    surveyId,
    handleParamChange,
    // TODO: Document props for anyone that might want to instantiate this
    ParamsEditor,
  };

  return createElement(renderComponent.paramsEditorComponent, {
    renderComponent,
    params,
    _context: paramsEditorContext,
  });
};

const PageItemEditor = () => {
  const { pages, id, mutate } = useFetchSurvey();
  const { selectedPageItem, setSelectedPageItem } = usePageListContext();

  if (!selectedPageItem?.itemId) return null;

  // Get the current Page, and get general Item actions, since we're not inside the context
  const page = pages.find(({ id }) => id === selectedPageItem.pageId);
  const { setParamValue } = pageItemActions(
    id,
    page.id,
    mutate,
    selectedPageItem,
    setSelectedPageItem
  );

  // get the item itself and its react component
  const item = page.components.find(({ id }) => id === selectedPageItem.itemId);
  if (!item) return null;
  const component = getComponent(item.type);

  // item specific change handler, to simplify things for the editor(s)
  const handleParamChange = (paramPath, paramValue) => {
    setParamValue(item.id, paramPath, paramValue);
  };

  return (
    <Flex align="flex-start" width="100%">
      {component.paramsEditorComponent ? (
        // If there's a custom editor, use it
        <PageItemCustomParamsEditor
          surveyId={id}
          pageId={page.id}
          itemId={item.id}
          renderComponent={component}
          params={item.params}
          handleParamChange={handleParamChange}
        />
      ) : (
        <ParamsEditor
          component={component}
          params={item.params}
          handleParamChange={handleParamChange}
        />
      )}
    </Flex>
  );
};

export default PageItemEditor;
