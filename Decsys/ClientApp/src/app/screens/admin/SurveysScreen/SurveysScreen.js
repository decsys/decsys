import React from "react";
import { useNavigation } from "react-navi";
import { useNaviReducer } from "../../../utils/hooks";
import PureSurveysScreen from "./PureSurveysScreen";
import SurveyCardContext from "../../../components/SurveyCard/Context";
import reducer, * as ducks from "./ducks";
import * as api from "../../../api";

const SurveysScreen = ({ surveys }) => {
  const [state, dispatch] = useNaviReducer(
    reducer,
    surveys,
    ducks.surveyMapReduce
  );

  const navigation = useNavigation();

  const handleCreateClick = () => dispatch(ducks.createSurvey());

  const surveyCardActions = {
    handleEditClick: id => navigation.navigate(`admin/survey/${id}`), // TODO: Routing state for placeholder?
    handleDeleteClick: id => dispatch(ducks.deleteSurvey(id)),
    handleDuplicateClick: id => dispatch(ducks.duplicateSurvey(id)),
    handleLaunchClick: id => dispatch(ducks.launchSurvey(id)),
    handleCloseClick: (surveyId, instanceId) =>
      dispatch(ducks.closeSurvey(surveyId, instanceId)),
    fetchSurveyConfig: async id => await api.getSurveyConfig(id),
    handleSurveyConfigSaveClick: async (id, config) =>
      await api.setSurveyConfig(id, config)
  };

  return (
    <SurveyCardContext.Provider value={surveyCardActions}>
      <PureSurveysScreen surveys={state} onCreateClick={handleCreateClick} />
    </SurveyCardContext.Provider>
  );
};

export default SurveysScreen;
