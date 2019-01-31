import React, { Component } from "react";
import { Row, Input, Box } from "@smooth-ui/core-sc";

import SortButtonsPanel from "./SortButtonsPanel";

class SurveyCardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      surveys: {
        1: { id: 1, name: "Jon Survey", runCount: 15, active: false },
        3: { id: 3, name: "Abc Survey", runCount: 10, active: true },
        2: { id: 2, name: "Lol Survey", runCount: 0, active: true }
      },

      sortedList: [],
      filteredList: [],

      sort: { key: "active", name: true }
    };
  }

  componentDidMount = () => this.sortList();

  /**
   * Sorts the master survey list according to the current Sort state.
   */
  sortList = () =>
    this.setState(({ surveys, sort }) => ({
      sortedList: Object.keys(surveys)
        .map(k => surveys[k])
        .sort(this.getPropertySorter(sort.key))
    }));

  /**
   * Filters the current Sorted List.
   *
   * If there is no Sorted List, there'll be no Filtered List contents.
   */
  filterList = () =>
    this.setState(({ filter, sortedList }) => {
      if (!filter) return; // catches filter === null, undefined, 0, "", false
      return {
        filteredList: sortedList.filter(({ name }) =>
          new RegExp(filter, "i").test(name)
        )
      };
    });

  /**
   * Returns the list of surveys to use in the view,
   * according to the following priority list:
   * - Filtered List
   * - Sorted List
   */
  getViewList = () =>
    !!this.state.filter ? this.state.filteredList : this.state.sortedList;

  /**
   * Gets the appropriate sort function for a given survey property
   */
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

  /** Handle a change of sorting */
  sortChange = key => {
    this.setState(({ sort }) => {
      const ascending =
        sort.key === key ? !sort[key] || false : sort[key] || false;
      sort.key = key;
      sort[key] = ascending;
      return { sort };
    });
    this.sortList(); // update the sort list based on the new state
    this.filterList(); // if necessary, update the filter list based on the new sort list
  };

  /** Handle a change of filter */
  filterChange = e => {
    this.setState({ filter: e.target.value });
    this.filterList(); // update the filter list based on the new state
  };

  /** Launch a run of a Survey */
  launchSurvey = id =>
    this.setState(({ surveys }) => {
      surveys[id].active = true;
      surveys[id].runCount++;
      return { surveys };
    });

  /** Close a currently active Survey run */
  closeSurvey = id =>
    this.setState(({ surveys }) => {
      surveys[id].active = false;
      return { surveys };
    });

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

        {this.getViewList().map((survey, i) => (
          <Row key={i}>
            <SurveyCard
              {...survey}
              onLaunchClick={this.launchSurvey}
              onCloseClick={this.closeSurvey}
            />
          </Row>
        ))}
      </>
    );
  }
}

export default SurveyCardList;
