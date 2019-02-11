import React, { Component, cloneElement, Children } from "react";
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

/**
 * A button which toggles a dropdown menu.
 *
 * All non specified props are passed onto the underlying `Button`.
 */
class DropdownMenuButton extends Component {
  static propTypes = {
    /** The actual button contents */
    button: PropTypes.node,
    /** Whether to automatically display a downwards arrow after the content */
    caret: PropTypes.bool
  };
  static defaultProps = { caret: true };

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

  /** Modify all menu items onClick to close the mneu before taking their action */
  renderChildren() {
    return Children.map(
      this.props.children,
      child =>
        !!child &&
        cloneElement(child, {
          onClick: e => {
            this.toggleMenu();
            if (typeof child.props.onClick === "function")
              child.props.onClick(e);
          }
        })
    );
  }

  render() {
    // remove props our top level component cares about
    // or stuff we mustn't pass down to the DOM
    const {
      button,
      caret,

      onClick: _, //we don't want to allow an override of this

      // used by onClickOutside HOC
      enableOnClickOutside,
      disableOnClickOutside,
      stopPropagation,
      preventDefault,
      outsideClickIgnoreClass,
      eventTypes,

      ...rest
    } = this.props;

    return (
      <div>
        <DropdownButton
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={this.toggleMenu}
          {...rest}
        >
          {button}
          {caret && (
            <>
              {" "}
              <CaretDown size="1em" />
            </>
          )}
        </DropdownButton>
        {this.state.open && (
          <DropdownMenu>{this.renderChildren()}</DropdownMenu>
        )}
      </div>
    );
  }
}

export default onClickOutside(DropdownMenuButton);
