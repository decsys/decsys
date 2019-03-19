import React, { useState, cloneElement, Children } from "react";
import onClickOutside from "react-onclickoutside";
import DropdownButton from "./DropdownButton";
import DropdownMenu from "./Menu";

/**
 * A button which toggles a dropdown menu.
 *
 * All non specified props are passed onto the underlying `Button`.
 */
const DropdownMenuButton = ({
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
}) => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);
  DropdownMenuButton.handleClickOutside = () => setOpen(false);
  return (
    <div>
      <DropdownButton onClick={toggleMenu} {...rest} />
      {open && (
        <DropdownMenu>
          {/** Modify all menu items onClick to close the mneu before taking their action */
          Children.map(
            children,
            child =>
              !!child &&
              cloneElement(child, {
                onClick: e => {
                  toggleMenu();
                  if (typeof child.props.onClick === "function")
                    child.props.onClick(e);
                }
              })
          )}
        </DropdownMenu>
      )}
    </div>
  );
};

export default onClickOutside(DropdownMenuButton, {
  handleClickOutside: () => DropdownMenuButton.handleClickOutside
});
