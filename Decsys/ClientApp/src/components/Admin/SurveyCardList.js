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
      sort: { name: true }
    };
  }

  componentDidMount() {
    this.numberSort("active"); //initial sort
  }

  numberSort = sortProp =>
    this.sortBy(sortProp, ({ [sortProp]: a }, { [sortProp]: b }, asc) =>
      asc ? a - b : b - a
    );

  stringSort = sortProp =>
    this.sortBy(sortProp, ({ [sortProp]: a }, { [sortProp]: b }, asc) =>
      asc ? a.localeCompare(b) : b.localeCompare(a)
    );

  sortBy = (sortProp, sorter) => {
    this.setState(prev => {
      const ascending =
        prev.sort.current === sortProp
          ? !prev.sort[sortProp] || false
          : prev.sort[sortProp] || false;
      prev.surveys.sort((a, b) => sorter(a, b, ascending));
      prev.sort.current = sortProp;
      prev.sort[sortProp] = ascending;
      return {
        sort: prev.sort,
        surveys: prev.surveys
      };
    });
  };

  filterChange = e => this.setState({ filter: e.target.value });

  render() {
    return (
      <>
        <Box display="flex" alignItems="center" mb="1em">
          <Box uiAs="span" mr=".5em" display={{ xs: "none", md: "inline" }}>
            Sort by:
          </Box>
          <SortButton
            {...this.state.sort}
            sortprop="active"
            sorter={this.numberSort}
          >
            Active
          </SortButton>
          <SortButton
            {...this.state.sort}
            sortprop="name"
            sorter={this.stringSort}
          >
            Name
          </SortButton>
          <SortButton
            {...this.state.sort}
            sortprop="runCount"
            sorter={this.numberSort}
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
