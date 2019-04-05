import React from "react";
import { Button, Box } from "@smooth-ui/core-sc";
import { useNavigation } from "react-navi";
import { TimesCircle, Rocket } from "styled-icons/fa-solid";

// General stuff we only use internally here, for now...
const IconButton = p => (
  <Button display="inline-flex" alignItems="center" {...p}>
    {p.children}
  </Button>
);

const LinkButton = ({ onClick, href, ...p }) => {
  const navigation = useNavigation();
  return (
    <Button textAlign="center" {...p} onClick={() => navigation.navigate(href)}>
      {p.children}
    </Button>
  );
};

export const Launch = ({ onClick }) => (
  <IconButton variant="success" onClick={onClick}>
    <Rocket size="1em" />
    <Box width="100%">Launch</Box>
  </IconButton>
);

export const Close = ({ onClick }) => (
  <IconButton variant="danger" onClick={onClick}>
    <TimesCircle size="1em" />
    <Box width="100%">Close</Box>
  </IconButton>
);

export const Dashboard = ({ id }) => (
  <LinkButton variant="success" href={`/admin/survey/${id}/dashboard`}>
    Dashboard
  </LinkButton>
);

export const Results = ({ id }) => (
  <LinkButton variant="secondary" href={`/admin/survey/${id}/results`}>
    Results
  </LinkButton>
);
