import React, { Component } from "react";
import styled, { withTheme } from "styled-components";
import { Grid, Button, Typography, Row, Box, Alert } from "@smooth-ui/core-sc";
import {
  PlusCircle,
  CaretDown,
  InfoCircle,
  Check,
  Times
} from "styled-icons/fa-solid";

const SortButton = styled(Button).attrs({
  backgroundColor: "none",
  fontWeight: props => (props.active ? "bold" : "normal")
})``;

const SurveyCard = withTheme(props => (
  <Box
    display="flex"
    alignItems="stretch"
    variant={props.active ? "success" : "dark"}
    width="100%"
    borderBottom={`thin solid ${props.theme.gray400}`}
    backgroundColor="gray200"
  >
    <Box
      display="flex"
      alignItems="center"
      p=".5em"
      mr="1em"
      backgroundColor={props.active ? "success" : "gray700"}
    >
      {props.active ? (
        <Check size="1em" color="white" />
      ) : (
        <Times size="1em" color="white" />
      )}
    </Box>

    <Box display="flex" width="100%" alignItems="center" p=".5em">
      <Typography variant="h5" mb={0}>
        {props.name}
      </Typography>
      <Box ml="auto">
        <Box
          backgroundColor="info"
          display="inline-block"
          px=".5em"
          borderRadius="8px"
          color="white"
        >
          {props.runCount} runs
        </Box>
        <Button ml=".5em" variant="success">
          Launch
        </Button>
        <Button ml=".5em" variant="secondary">
          {/* Dropdown Button component */}
          Manage <CaretDown size="1em" />
        </Button>
      </Box>
    </Box>
  </Box>
));

class SurveyCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveys: [
        { id: 1, name: "Jon Survey", runCount: 0, active: false },
        { id: 3, name: "Abc Survey", runCount: 0, active: true },
        { id: 2, name: "Lol Survey", runCount: 0, active: true }
      ],
      sort: {
        current: "active"
      }
    };
  }

  componentDidMount() {
    this.sort("active");
  }

  sort = sortProp => {
    this.setState(prev => {
      const ascending =
        prev.sort.current === sortProp
          ? !prev.sort[sortProp] || false
          : prev.sort[sortProp] || false;
      prev.surveys.sort((a, b) =>
        ascending
          ? a[sortProp] > b[sortProp]
            ? -1
            : 1
          : a[sortProp] < b[sortProp]
          ? -1
          : 1
      );
      return {
        sort: { [sortProp]: ascending, current: sortProp },
        surveys: prev.surveys
      };
    });
  };

  render() {
    return (
      <>
        <SortButton
          onClick={e => this.sort("name", e)}
          active={this.state.sort.current === "name"}
        >
          Sort by Name
        </SortButton>
        <SortButton
          onClick={e => this.sort("active", e)}
          active={this.state.sort.current === "active"}
        >
          Sort by Active
        </SortButton>
        {this.state.surveys.map((survey, i) => (
          <Row key={i}>
            <SurveyCard {...survey} />
          </Row>
        ))}
      </>
    );
  }
}

const SurveyList = props => (
  <>
    <Grid>
      <Row my="3em">
        <Typography variant="h1">My Surveys</Typography>
        <Box ml="auto" display="flex" alignItems="center">
          <Button variant="secondary">
            <PlusCircle size="1em" /> Create New Survey
          </Button>
        </Box>
      </Row>
      <Row>
        <Alert width="100%" variant="info">
          <InfoCircle size="1em" /> Please don't forget to backup your surveys
          and results to an external source.
        </Alert>
      </Row>
      <SurveyCardList />
    </Grid>
  </>
);

export default SurveyList;
