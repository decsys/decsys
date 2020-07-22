import React from "react";
import PropTypes from "prop-types";
import { FlexBox } from "components/core";
import PageHeader from "./PageHeader";
import PageComponent from "./PageComponent";
import PageItem from "./PageItem";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { isBuiltIn } from "services/page-items";

const Page = ({
  page,
  currentComponent,
  componentList,
  n,
  itemActions,
  pageActions,
  onComponentChange,
  pageListProvided
}) => {
  return (
    <Droppable type={page.id} droppableId={page.id}>
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <FlexBox
            flexDirection="column"
            border={1}
            borderColor="cardBorder"
            backgroundColor="lightest"
          >
            <PageHeader
              provided={pageListProvided}
              n={n}
              actions={pageActions}
              page={page}
            />

            {page.components
              .sort(({ order: a }, { order: b }) => a - b)
              .map(x => (
                <Draggable
                  type={page.id}
                  key={x.id}
                  draggableId={x.id}
                  index={x.order - 1}
                >
                  {provided => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      {!isBuiltIn(x.type) ? (
                        <PageComponent
                          provided={provided}
                          components={componentList}
                          selected={
                            x.id ===
                            (currentComponent && currentComponent.component.id)
                          }
                          currentType={x.type}
                          onClick={() => itemActions.onClick(page.id, x)}
                          onComponentChange={type =>
                            onComponentChange(page.id, type, x.id, x.order)
                          }
                        />
                      ) : (
                        <PageItem
                          provided={provided}
                          selected={
                            x.id ===
                            (currentComponent && currentComponent.component.id)
                          }
                          id={x.id}
                          pageId={page.id}
                          type={x.type}
                          params={x.params}
                          {...{
                            ...itemActions,
                            onClick: () => itemActions.onClick(page.id, x)
                          }}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
            {page.components.every(x => isBuiltIn(x.type)) && (
              <PageComponent
                components={componentList}
                onComponentChange={type => onComponentChange(page.id, type)}
              />
            )}
          </FlexBox>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

Page.propTypes = {
  n: PageHeader.propTypes.n,
  pageActions: PageHeader.propTypes.actions,
  itemActions: PropTypes.shape({
    onDeleteClick: PropTypes.func.isRequired,
    onDuplicateClick: PropTypes.func.isRequired
  }),
  onComponentChange: PropTypes.func.isRequired,
  page: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    components: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        params: PropTypes.shape({}).isRequired
      })
    )
  }),
  componentList: PageComponent.propTypes.components
};

export default Page;