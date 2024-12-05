import { useState, useEffect } from "react";

export function useFilterSurveys(surveys, filterType) {
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  useEffect(() => {
    let updatedSurveys = [];
    if (surveys) {
      switch (filterType) {
        case "archived":
          updatedSurveys = surveys.filter(
            (survey) => survey.archivedDate !== null
          );
          break;
        case "unarchived":
          updatedSurveys = surveys.filter(
            (survey) => survey.archivedDate == null
          );
          break;
        default:
          updatedSurveys = [...surveys];
      }
      setFilteredSurveys(updatedSurveys);
    }
  }, [surveys, filterType]);

  return filteredSurveys;
}
