import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "@smooth-ui/core-sc";
import { CaretDown } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";
import styled from "styled-components";
import onClickOutside from "react-onclickoutside";

const DropdownMenu = styled(FlexBox).attrs(props => ({
  backgroundColor: "white",
  border: 1,
  borderColor: props.theme.gray400,
  borderRadius: 5,
  flexDirection: "column",
  py: 1
}))`
  position: absolute;
  z-index: 10;
  min-width: 10em;
`;

const DropdownButton = styled(Button)`
  position: relative;
`;

class DropdownMenuButton extends Component {
  static propTypes = {
    button: PropTypes.node,
    caret: PropTypes.bool
  };
  static defaultProps = {};

  constructor() {
    super();
    this.state = { open: false }; // literally we only store menu open state?
  }

  handleClickOutside = () => {
    this.setState({
      open: false
    });
  };

  toggleMenu = () =>
    this.setState(prev => ({
      open: !prev.open
    }));

  render() {
    return (
      <div>
        <DropdownButton
          display="inline-flex"
          justifyContent="space-between"
          alignItems="center"
          variant="secondary"
          onClick={this.toggleMenu}
        >
          {this.props.button} {this.caret ? <CaretDown size="1em" /> : null}
        </DropdownButton>
        {this.state.open && <DropdownMenu>{this.props.children}</DropdownMenu>}
      </div>
    );
  }
}

export default onClickOutside(DropdownMenuButton);
