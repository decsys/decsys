import React, { Component, cloneElement, Children } from "react";
import onClickOutside from "react-onclickoutside";
import DropdownButton from "./DropdownButton";
import DropdownMenu from "./Menu";

/**
 * A button which toggles a dropdown menu.
 *
 * All non specified props are passed onto the underlying `Button`.
 */
class DropdownMenuButton extends Component {
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
        <DropdownButton onClick={this.toggleMenu} {...rest} />
        {this.state.open && (
          <DropdownMenu>{this.renderChildren()}</DropdownMenu>
        )}
      </div>
    );
  }
}

export default onClickOutside(DropdownMenuButton);
