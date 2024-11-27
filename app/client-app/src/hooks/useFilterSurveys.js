import { useState, useEffect } from "react";

export function useFilterSurveys(surveysFromApi, filterType) {
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  useEffect(() => {
    let updatedSurveys = [];
    if (surveysFromApi) {
      switch (filterType) {
        case "archived":
          updatedSurveys = surveysFromApi.filter(
            (survey) => survey.archivedDate !== null
          );
          break;
        case "unarchived":
          updatedSurveys = surveysFromApi.filter(
            (survey) => survey.archivedDate == null
          );
          break;
        default:
          updatedSurveys = [...surveysFromApi];
      }
      setFilteredSurveys(updatedSurveys);
    }
  }, [surveysFromApi, filterType]);

  return filteredSurveys;
}
