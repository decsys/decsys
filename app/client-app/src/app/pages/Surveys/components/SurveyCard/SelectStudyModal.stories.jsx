import { SelectStudyModal } from "./SelectStudyModal";
import { surveys } from "./StudySelectList.stories";
//TODO: Replace action with controls
//import { action } from "@storybook/addon-actions";
import { SurveysListProvider } from "../../contexts/SurveysList";
import { SurveyCardActionsProvider } from "../../contexts/SurveyCardActions";

/* eslint-disable-next-line */
export default {
  title: "Select Study Modal",
  component: SelectStudyModal,
  decorators: [
    (Story) => (
      <SurveysListProvider value={{ surveys, mutateSurveys: () => {} }}>
        <SurveyCardActionsProvider
          value={
            {
              //changeStudy: action("Study Change recorded"),
            }
          }
        >
          <Story />
        </SurveyCardActionsProvider>
      </SurveysListProvider>
    ),
  ],
};

const modalState = {
  isOpen: true,
  // onOpen: action("Modal opened"),
  // onClose: action("Modal closed"),
  //onToggle: action("Modal toggled"),
};

export const Basic = () => (
  <SelectStudyModal
    name="My Survey"
    id={1}
    size="2xl"
    modalState={modalState}
  />
);
