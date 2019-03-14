import React from "react";
import { Button, Box } from "@smooth-ui/core-sc";
import { Link } from "react-router-dom";
import { TimesCircle, Rocket } from "styled-icons/fa-solid";

// General stuff we only use internally here, for now...
const IconButton = p => (
  <Button display="inline-flex" alignItems="center" {...p}>
    {p.children}
  </Button>
);
const LinkButton = p => (
  <Button textAlign="center" as={Link} {...p}>
    {p.children}
  </Button>
);

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
  <LinkButton variant="success" to={`survey/${id}/dashboard`}>
    Dashboard
  </LinkButton>
);

export const Results = ({ id }) => (
  <LinkButton variant="secondary" to={`survey/${id}/results`}>
    Results
  </LinkButton>
);
