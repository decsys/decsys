import React from "react";
import { useHistory } from "@docusaurus/router";
import { Button } from "@chakra-ui/react";

/** A Chakra Button for a Docusaurus internal (React Router) Link */
const LinkButton = ({ to, ...p }) => {
  const history = useHistory();
  const handleClick = ({ target }) => {
    history.push(target.dataset.to);
  };

  return <Button onClick={handleClick} data-to={to} {...p} />;
};

export default LinkButton;
