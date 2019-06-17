import React from "react";
import AppBarLink from "../AppBar/Link";
import { ExternalLinkAlt } from "styled-icons/fa-solid";

const AboutLink = ({ href, ...p }) => {
  return (
    <AppBarLink
      variant="light"
      {...p}
      href="http://www.lucidresearch.org/decsys.html"
    >
      About DECSYS{" "}
      <sup>
        <ExternalLinkAlt size="1em" />
      </sup>
    </AppBarLink>
  );
};

export default AboutLink;
