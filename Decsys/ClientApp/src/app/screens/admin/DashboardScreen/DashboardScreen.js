import React, { useState, useEffect } from "react";
import { Container, ConfirmModal } from "../../../components/ui";
import AppBar from "../../../components/AppBar";
import { Typography } from "@smooth-ui/core-sc";
import ProgressCard from "../../../components/ui/ProgressCard";
import { InfoCircle } from "styled-icons/fa-solid";
import { useModal } from "../../../components/ui/ConfirmModal";
import {
  getComponent,
  getResponseComponent
} from "../../../utils/component-utils";

const DashboardScreen = ({ survey, results }) => {
  const statsModal = useModal();
  const [statsPage, setStatsPage] = useState();
  const [statsComponent, setStatsComponent] = useState();
  // useEffect(() => {
  //   if (!statsPage) return;
  //   const details = getResponseComponent(statsPage.components);
  //   const component = getComponent(details.type);
  //   const stats =
  //     component.stats || (() => ({ visualizations: [{}], stats: [] }));
  //   setStatsComponent({
  //     details,
  //     stats
  //   });
  // }, [statsPage]);

  const getStatsComponent = () => {
    if (!statsPage) return null;
    const details = getResponseComponent(statsPage.components);
    const component = getComponent(details.type);
    const stats =
      component.stats || (() => ({ visualizations: [{}], stats: [] }));

    return stats(
      details.params,
      Object.keys(resultsByPage[statsPage.order]).map(
        pid => resultsByPage[statsPage.order][pid]
      )
    ).visualizations[0].component;
  };

  const resultsByPage = results.participants.reduce((a, p) => {
    p.responses.forEach(r => {
      a[r.page] = a[r.page] || {};
      a[r.page][p.id] = r.response;
    });
    return a;
  }, []);

  const completionByPage = survey.pages.map((_, i) =>
    results.participants.reduce((a, { id }) => {
      a[id] = !!resultsByPage[i + 1][id];
      return a;
    }, {})
  );

  const handleCardClick = i => {
    setStatsPage(survey.pages[i]);
    statsModal.toggleModal();
  };

  return (
    <>
      <AppBar brand="DECSYS" />
      <Container>
        <Typography my={2} variant="h2">
          {survey.name}
        </Typography>
        <Typography mb={2} variant="h3">
          Dashboard for {results.instance}
        </Typography>
        <Typography mb={2} variant="h5">
          Participant progress by Question
        </Typography>
        <Typography as="div" color="info" mb={2}>
          <InfoCircle size="1em" /> Click a Question's card for more details.
        </Typography>
        {survey.pages.map(
          (p, i) =>
            !!getResponseComponent(p.components) && (
              <ProgressCard
                key={i}
                title={`Q${i + 1}`}
                total={results.participants.length}
                progressData={Object.keys(completionByPage[i]).map(id => ({
                  complete: completionByPage[i][id]
                }))}
                onClick={() => handleCardClick(i)}
              />
            )
        )}
      </Container>
      {statsPage && (
        <ConfirmModal header={`Q${statsPage.order} Stats`} {...statsModal}>
          {getStatsComponent()}
        </ConfirmModal>
      )}
    </>
  );
};

export default DashboardScreen;
