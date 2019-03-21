import React from "react";
import { withRouter } from "react-router-dom";
import { Button as SmoothButton } from "@smooth-ui/core-sc";

const Button = props => (
  <SmoothButton borderRadius={0} width="120px" variant="secondary" {...props} />
);

const LinkButton = withRouter(
  ({ to, history, onClick, staticContext, ...p }) => (
    <Button {...p} onClick={() => history.push(to)}>
      {p.children}
    </Button>
  )
);

export { LinkButton };

export default Button;
