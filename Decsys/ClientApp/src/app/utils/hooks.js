import { useReducer } from "react";
import { useNavigation } from "react-navi";
import { exportDateFormat } from "./date-formats";
import * as api from "../api";

const thunkedDispatch = (dispatch, ...otherArgs) => thunk =>
  typeof thunk === "function"
    ? dispatch(thunk(thunkedDispatch(dispatch, ...otherArgs), ...otherArgs))
    : dispatch(thunk);

export const useThunkReducer = (reducer, initArg, init) => {
  const [state, dispatch] = useReducer(reducer, initArg, init);
  return [state, thunkedDispatch(dispatch)];
};

export const useNaviReducer = (reducer, initArg, init) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initArg, init);
  return [state, thunkedDispatch(dispatch, navigation)];
};

/**
 * Returns a function for downloading survey structure as a json file
 *
 * @param {number|object} survey
 * Either the survey id, or a complete survey object
 *
 * If an id, the survey data for that id will be fetched.
 *
 * If an object, the data passed will be used
 */
export const useSurveyExport = survey => {
  if (typeof survey === "number")
    (async () => {
      const { data } = await api.getSurvey(survey);
      survey = data;
    })();

  const downloadFile = () => {
    const file = new Blob([JSON.stringify(survey)], {
      type: "application/json"
    });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = `Survey-${survey.name}_${exportDateFormat(new Date())}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return downloadFile;
};
