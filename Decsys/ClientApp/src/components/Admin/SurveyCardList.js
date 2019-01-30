import React, { Component } from "react";
import { Button, Row, Input, Box } from "@smooth-ui/core-sc";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";

import SurveyCard from "./SurveyCard";

const SortButton = ({ sortby, current, sorter, children }) => (
  <Button
    variant="white"
    fontWeight={current.key === sortby ? "bold" : "normal"}
    onClick={e => sorter(sortby, e)}
  >
    {children}{" "}
    {current[sortby] ? <CaretUp size="1em" /> : <CaretDown size="1em" />}
  </Button>
);

const SortButtonsPanel = ({ keys, current, sorter }) =>
  keys.map((sortKey, i) => {
    const button = (label, key) => (
      <SortButton key={i} sortby={key} current={current} sorter={sorter}>
        {label}
      </SortButton>
    );
    return typeof sortKey === "string"
      ? button(sortKey, sortKey.toLocaleLowerCase())
      : button(sortKey[0], sortKey[1]);
  });

class SurveyCardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      surveys: {
        1: { id: 1, name: "Jon Survey", runCount: 15, active: false },
        2: { id: 3, name: "Abc Survey", runCount: 10, active: true },
        3: { id: 2, name: "Lol Survey", runCount: 0, active: true }
      },
      sort: { key: "active", name: true }
    };
  }

  getPropertySorter = key => {
    switch (key) {
      case "name":
        return ({ [key]: a }, { [key]: b }) =>
          this.state.sort[key] ? a.localeCompare(b) : b.localeCompare(a);
      default:
        return ({ [key]: a }, { [key]: b }) =>
          this.state.sort[key] ? a - b : b - a;
    }
  };

  sortChange = key => {
    this.setState(({ sort }) => {
      const ascending =
        sort.key === key ? !sort[key] || false : sort[key] || false;
      sort.key = key;
      sort[key] = ascending;
      return { sort };
    });
  };

  filterChange = e => this.setState({ filter: e.target.value });

  render() {
    return (
      <>
        <Row alignItems="center" mb="1em">
          <Box uiAs="span" mr=".5em" display={{ xs: "none", md: "inline" }}>
            Sort by:
          </Box>

          <SortButtonsPanel
            keys={["Active", "Name", ["Run Count", "runCount"]]}
            current={this.state.sort}
            sorter={this.sortChange}
          />

          <Input
            size="sm"
            ml="auto"
            placeholder="Filter"
            onChange={this.filterChange}
          />
        </Row>

        {Object.keys(this.state.surveys)
          .map(k => this.state.surveys[k])
          .filter(({ name }) =>
            this.state.filter != null
              ? new RegExp(this.state.filter, "i").test(name)
              : true
          )
          .sort(this.getPropertySorter(this.state.sort.key))
          .map((survey, i) => (
            <Row key={i}>
              <SurveyCard {...survey} />
            </Row>
          ))}
      </>
    );
  }
}

export default SurveyCardList;
