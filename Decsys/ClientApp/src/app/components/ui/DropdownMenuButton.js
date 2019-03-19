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
  // This needs to be a class for onClickOutside :(
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggleMenu = () => this.setState(prev => ({ open: !prev.open }));
  handleClickOutside = () => this.setState(prev => ({ open: false }));

  render() {
    const {
      onClick: _, //we don't want to allow an override of this
      children,
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
          <DropdownMenu>
            {/** Modify all menu items onClick to close the mneu before taking their action */
            Children.map(
              children,
              child =>
                !!child &&
                cloneElement(child, {
                  onClick: e => {
                    this.toggleMenu();
                    if (typeof child.props.onClick === "function")
                      child.props.onClick(e);
                  }
                })
            )}
          </DropdownMenu>
        )}
      </div>
    );
  }
}

export default onClickOutside(DropdownMenuButton);
