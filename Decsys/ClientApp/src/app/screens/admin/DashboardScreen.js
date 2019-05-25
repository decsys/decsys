import React from "react";
import { Container } from "../../components/ui";
import AppBar from "../../components/AppBar";
import { Typography } from "@smooth-ui/core-sc";
import ProgressCard from "../../components/ui/ProgressCard";
import { InfoCircle } from "styled-icons/fa-solid";

const DashboardScreen = ({ survey, results }) => {
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
        {survey.pages.map((p, i) => (
          <ProgressCard
            key={i}
            title={`Q${i + 1}`}
            total={results.participants.length}
            progressData={Object.keys(completionByPage[i]).map(id => ({
              complete: completionByPage[i][id]
            }))}
          />
        ))}
      </Container>
    </>
  );
};

export default DashboardScreen;
