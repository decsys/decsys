import React from "react";
import ParamsEditor from "./ParamsEditor";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { usePageListContext } from "../../contexts/PageList";
import { getComponent } from "services/page-items";
import pageItemActions from "../../actions/pageItemActions";

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
  const handleParamChange = (paramKey, paramValue) => {
    setParamValue(item.id, paramKey, paramValue);
  };

  // TODO: Custom Editor (e.g. Image Upload)
  return (
    <ParamsEditor
      component={component}
      params={item.params}
      onParamChange={handleParamChange}
    />
  );
};

export default PageItemEditor;
