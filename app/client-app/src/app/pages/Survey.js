import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useLayoutEffect,
} from "react";
import { Page } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { navigate } from "@reach/router";
import { decode } from "services/instance-id";
import { useSurveyInstance } from "api/survey-instances";
import Error from "./Error";
import { useLocalInstances } from "app/contexts/LocalInstances";
import { PAGE_RANDOMIZE, SURVEY_COMPLETE } from "constants/event-types";
import {
  getLastLogEntry,
  logParticipantEvent,
} from "api/participant-event-logs";
import { randomize } from "services/randomizer";
import Loading from "./Loading";
import { routes, bootstrapSurvey } from "services/survey-bootstrap";
import ParticipantIdEntry from "./ParticipantIdEntry";
import ErrorBoundary from "components/ErrorBoundary";
import SurveyNotFoundError, { errorCallToAction } from "./SurveyNotFoundError";

//Contexts all the way down?
var InstanceContext = createContext();
const useInstance = () => useContext(InstanceContext);

// Do all the data fetching and validation ahead of rendering the survey
const SurveyBootstrapper = ({ id }) => {
  const { data: instance } = useSurveyInstance(...decode(id));
  const { instances, storeInstanceParticipantId } = useLocalInstances();
  const [route, setRoute] = useState();
  const [userId, setUserId] = useState();
  const [progress, setProgress] = useState({});

  useLayoutEffect(() => {
    bootstrapSurvey(id, instance, instances).then(
      ({ route, userId, progress }) => {
        setRoute(route);
        setUserId(userId);
        setProgress(progress || {});
        storeInstanceParticipantId(id, userId);
      }
    );
  }, [id, instance, instances, storeInstanceParticipantId]);

  // render appropriately based on
  // the route arrived at during the above render
  switch (route) {
    case routes.INSTANCE_404:
      return <SurveyNotFoundError />;
    case routes.SURVEY_EMPTY:
      return (
        <Error
          message={"That Survey contains no pages."}
          callToAction={errorCallToAction}
        />
      );
    case routes.PARTICIPANT_ID_ENTRY:
      return (
        <ParticipantIdEntry
          combinedId={id}
          validIdentifiers={instance.validIdentifiers}
        />
      );
    case routes.SURVEY_COMPLETED:
      navigate(`/survey/${id}/complete`);
      return null;
    case routes.BOOTSTRAP_COMPLETE:
      return (
        <InstanceContext.Provider value={instance}>
          <Survey combinedId={id} userId={userId} progressStatus={progress} />
        </InstanceContext.Provider>
      );
    default:
      return <Loading />;
  }
};

// TODO: move the callbacks out to static methods in the survey-bootstrap service
const Survey = ({ combinedId, userId, progressStatus }) => {
  const instance = useInstance();
  const [pages, setPages] = useState([]);

  const randomizePageOrder = useCallback(async () => {
    const order = randomize(
      instance.survey.pages.reduce((a, page) => {
        a[page.id] = page.randomize;
        return a;
      }, {})
    );
    await logParticipantEvent(
      instance.id,
      userId,
      instance.survey.id,
      PAGE_RANDOMIZE,
      {
        order,
      }
    );
    return order;
  }, [instance, userId]);

  const getPageOrder = useCallback(async () => {
    let random;
    try {
      random = (
        await getLastLogEntry(
          instance.id,
          userId,
          instance.survey.id,
          PAGE_RANDOMIZE
        )
      ).data;
    } catch (err) {
      if (err.response && err.response.status === 404) random = null;
      else throw err;
    }

    return random == null ? await randomizePageOrder() : random.payload.order;
  }, [instance, userId, randomizePageOrder]);

  useEffect(() => {
    if (userId) {
      // if the user or the instance are different
      // get page order
      getPageOrder().then((order) => {
        setPages(
          instance.survey.pages
            .map((x) => ({ ...x, order: order.indexOf(x.id) + 1 }))
            .sort((a, b) => a.order - b.order)
        );
      });
    }
  }, [instance, userId, getPageOrder]);

  const logEvent = useCallback(
    async (source, type, payload) => {
      await logParticipantEvent(instance.id, userId, source, type, payload);
    },
    [instance.id, userId]
  );

  // we set an initialPage value
  // based on progressStatus provided to us
  // about the current Participant ID
  let initialPage;
  if (progressStatus.completed && progressStatus.oneTimeParticipants)
    initialPage = pages.length;
  else if (progressStatus.inProgress)
    initialPage = pages.findIndex(
      (x) => x.id === progressStatus.lastPageLoaded
    );
  else initialPage = 0;

  const [page, setPage] = useState(initialPage < 0 ? 0 : initialPage);

  const [lastPage, setLastPage] = useState(false);
  useEffect(() => {
    if (pages.length) {
      // check if we are beyond lastPage
      // (e.g. resuming an already completed one time survey)
      if (page >= pages.length) {
        logEvent(instance.survey.id, SURVEY_COMPLETE, {});
        navigate(`/survey/${combinedId}/complete`);
        return;
      }

      // if no reason to navigate to the completion page,
      // then do an ordinary lastPage check
      setLastPage(page >= pages.length - 1);
    }
  }, [page, combinedId, logEvent, pages.length, instance.survey.id]);

  const handleClick = () => {
    // TODO confirm modal? if (lastPage)
    setPage(page + 1);
  };

  if (!pages.length || !pages[page]) return <Loading />;

  return (
    <Page layout="survey">
      <SurveyPage
        surveyId={instance.survey.id}
        page={pages[page]}
        lastPage={lastPage}
        handleNextClick={handleClick}
        logEvent={logEvent}
      />
    </Page>
  );
};

// Wrap everything in an error boundary,
// to catch errors from getting the instance via SWR (404, 400...)
const SurveyWrapper = ({ id }) => (
  <ErrorBoundary fallback={<SurveyNotFoundError />}>
    <SurveyBootstrapper id={id} />
  </ErrorBoundary>
);

export default SurveyWrapper;
