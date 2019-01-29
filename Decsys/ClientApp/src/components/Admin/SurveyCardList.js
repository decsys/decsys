import React, { Component } from "react";
import { Button, Row, Input, Box } from "@smooth-ui/core-sc";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";

import SurveyCard from "./SurveyCard";

const SortButton = props => (
  <Button
    variant="white"
    fontWeight={props.current === props.sortprop ? "bold" : "normal"}
    onClick={e => props.sorter(props.sortprop, e)}
  >
    {props.children}{" "}
    {props[props.sortprop] ? <CaretUp size="1em" /> : <CaretDown size="1em" />}
  </Button>
);

class SurveyCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveys: [
        { id: 1, name: "Jon Survey", runCount: 15, active: false },
        { id: 3, name: "Abc Survey", runCount: 10, active: true },
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
      prev.sort.current = sortProp;
      prev.sort[sortProp] = ascending;
      return {
        sort: prev.sort,
        surveys: prev.surveys
      };
    });
  };

  filterChange = e => {
    this.setState({ filter: e.target.value });
  };

  render() {
    return (
      <>
        <Box display="flex" alignItems="center">
          Sort by:
          <SortButton {...this.state.sort} sortprop="active" sorter={this.sort}>
            Active
          </SortButton>
          <SortButton {...this.state.sort} sortprop="name" sorter={this.sort}>
            Name
          </SortButton>
          <SortButton
            {...this.state.sort}
            sortprop="runCount"
            sorter={this.sort}
          >
            Run Count
          </SortButton>
          <Input
            size="sm"
            ml="auto"
            placeholder="Filter"
            onChange={this.filterChange}
          />
        </Box>

        {this.state.surveys
          .filter(({ name }) =>
            this.state.filter != null
              ? new RegExp(this.state.filter, "i").test(name)
              : true
          )
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
