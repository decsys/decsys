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
import { useUsers } from "contexts/UsersContext";
import { PAGE_RANDOMIZE } from "constants/event-types";
import {
  getLastLogEntry,
  logParticipantEvent,
} from "api/participant-event-logs";
import { randomize } from "services/randomizer";
import Loading from "./Loading";
import useSWR from "swr";
import { routes, bootstrapSurvey } from "services/survey-bootstrap";

//Contexts all the way down?
var InstanceContext = createContext();
const useInstance = () => useContext(InstanceContext);

const SurveyBootstrapper = ({ id }) => {
  const { data: instance } = useSurveyInstance(...decode(id));
  const { user, users } = useUsers();
  const {
    data: { route, userId },
  } = useSWR(
    () => `surveyBootstrap_${id}`, // TODO: is this key good enough?
    bootstrapSurvey(id, instance, user, users),
    {
      suspense: true,
    }
  );

  // render appropriately based on
  // the route arrived at during the above render
  switch (route) {
    // Errors
    case routes.INSTANCE_404:
      let errorMessage =
        "We couldn't find that Survey. It may have closed already.";
    case routes.SURVEY_EMPTY: // eslint-disable-line
      errorMessage = "That Survey contains no pages.";
      return (
        <Error
          message={errorMessage}
          callToAction={{
            label: "Try a different ID",
            onClick: () => {
              navigate("/survey");
            },
          }}
        />
      );
    case routes.PARTICIPANT_ID_ENTRY:
      return <div>Participant ID Entry Page</div>;
    case routes.SURVEY_COMPLETED:
      return <div>You've already completed this survey!</div>;
    default:
      return (
        <InstanceContext.Provider value={instance}>
          <Survey userId={userId} />
        </InstanceContext.Provider>
      );
  }
};

const Survey = ({ userId }) => {
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
    if (lastPage) return navigate(-1); // TODO Complete
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

export default SurveyBootstrapper;
