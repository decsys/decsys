import { SelectStudyModal } from "./SelectStudyModal";
import { surveys } from "./StudySelectList.stories";
import { SurveysListProvider } from "../../contexts/SurveysList";
import { SurveyCardActionsProvider } from "../../contexts/SurveyCardActions";

/* eslint-disable-next-line */
export default {
  title: "Select Study Modal",
  component: SelectStudyModal,
  decorators: [
    (Story, context) => (
      <SurveysListProvider value={{ surveys, mutateSurveys: () => {} }}>
        <SurveyCardActionsProvider
          value={{
            changeStudy: context.args.changeStudy,
          }}
        >
          <Story />
        </SurveyCardActionsProvider>
      </SurveysListProvider>
    ),
  ],
  argTypes: {
    changeStudy: { action: "Study Change recorded" },
    onOpen: { action: "Modal opened" },
    onClose: { action: "Modal closed" },
    onToggle: { action: "Modal toggled" },
  },
};

export const Basic = (args) => (
  <SelectStudyModal
    name="My Survey"
    id={1}
    size="2xl"
    modalState={{
      isOpen: true,
      onOpen: args.onOpen,
      onClose: args.onClose,
      onToggle: args.onToggle,
    }}
  />
);
