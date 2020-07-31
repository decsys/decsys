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
import { navigate, redirectTo } from "@reach/router";
import { decode } from "services/instance-id";
import { useSurveyInstance } from "api/survey-instances";
import Error from "./Error";
import { useUsers } from "contexts/UsersContext";
import { PAGE_RANDOMIZE } from "constants/event-types";
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
  const { user, users } = useUsers();
  const [route, setRoute] = useState();
  const [userId, setUserId] = useState();

  useLayoutEffect(() => {
    (async () => {
      const { route, userId } = await bootstrapSurvey(
        id,
        instance,
        user,
        users
      );
      setRoute(route);
      setUserId(userId);
    })();
  }, [id, instance, user, users]);

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
          setUserId={setUserId}
        />
      );
    case routes.SURVEY_COMPLETED:
      return redirectTo(`/survey/${id}/complete`);
    default:
      return (
        <InstanceContext.Provider value={instance}>
          <Survey combinedId={id} userId={userId} />
        </InstanceContext.Provider>
      );
  }
};

// TODO: move the callbacks out to static methods in the survey-bootstrap service
const Survey = ({ combinedId, userId }) => {
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

  useLayoutEffect(() => {
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

  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);

  const handleClick = () => {
    if (lastPage) return navigate(`/survey/${combinedId}/complete`);
    setPage(page + 1);
  };

  if (!pages.length) return <Loading />;

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
