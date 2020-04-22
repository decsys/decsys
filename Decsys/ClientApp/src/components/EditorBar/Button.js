import React from "react";
import { Button as SmoothButton } from "@smooth-ui/core-sc";
import { useNavigation } from "react-navi";

const Button = props => (
  <SmoothButton borderRadius={0} width="120px" variant="secondary" {...props} />
);

const LinkButton = ({ onClick, href, ...p }) => {
  const navigation = useNavigation();
  return (
    <Button textAlign="center" {...p} onClick={() => navigation.navigate(href)}>
      {p.children}
    </Button>
  );
};

export { LinkButton };

export default Button;
