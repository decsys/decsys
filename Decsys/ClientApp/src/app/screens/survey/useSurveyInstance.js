import { useState, useEffect } from "react";
import Axios from "axios";

const useSurveyInstance = id => {
  const [instance, setInstance] = useState({});
  useEffect(async () => {
    const tidyUp = () => setInstance({});

    // is the id an actual active instance
    const [activeSurvey] = (await Axios.get("/api/surveys")).data.filter(
      ({ activeInstanceId }) => activeInstanceId === id
    );
    if (!activeSurvey) {
      setInstance({ ...instance, invalid: true });
      return tidyUp;
    }

    // get survey pages
    const { pages } = await Axios.get(`/api/surveys/${activeSurvey.id}`);
    setInstance({
      ...instance,
      surveyId: activeSurvey.id,
      instanceId: id,
      pages
    });

    // tidy up
    return tidyUp;
  }, [id]);
  return instance;
};

export default useSurveyInstance;
