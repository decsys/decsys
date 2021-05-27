import StandardModal from "components/core/StandardModal";

// There are a number of ways to create a survey: Blank, Import, Duplicate etc.
// But they also all require some common follow up information
// This modal gathers that information and then executes a handler
// that accepts the new information, and deals with the previously chosen type of creation
const CreateSurveyModal = ({ onCreate, modalState }) => {
  // TODO: State/Form entry?
  const name = "hello";
  const type = "prolific";
  const settings = {
    studyId: "lol",
  };

  const handleConfirm = () => {
    onCreate(name, type, settings);
    modalState.onClose();
  };

  return (
    <StandardModal
      size="lg"
      {...modalState}
      header="Delete Survey"
      confirmButton={{
        colorScheme: "red",
        children: "Delete survey",
        onClick: handleConfirm,
      }}
    >
      Hello there
    </StandardModal>
  );
};

export { CreateSurveyModal };
