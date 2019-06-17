import React from "react";
import { Link } from "react-navi";
import { QuestionCircle, ExternalLinkAlt } from "styled-icons/fa-solid";

const AboutLink = () => {
  return (
    <Link
      href="http://www.lucidresearch.org/decsys.html"
      style={{ textDecoration: "none" }}
    >
      About DECSYS{" "}
      <sup>
        <ExternalLinkAlt size="1em" />
      </sup>
    </Link>
  );
};

export default AboutLink;
