/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"; // eslint-disable-line no-unused-vars
import Link from "@docusaurus/Link";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useThemeConfig } from "@docusaurus/theme-common";

/**
 * Opt-in with the "abs:" prefix.
 *
 * Allows a relative link to be navigated to "properly" instead of within the router,
 * by converting it to an absolute link on the same origin.
 * @param {*} href
 * @returns
 */
const buildAbsoluteLink = (href) => {
  if (!href.startsWith("abs:")) return href;

  let relHref = href.replace("abs:", "");
  if (!relHref.startsWith("/")) relHref = `/${relHref}`;
  console.log(href, relHref);
  return `${window.location.origin}${relHref}`;
};

const Logo = (props) => {
  const {
    siteConfig: { title },
  } = useDocusaurusContext();
  const {
    navbar: {
      title: navbarTitle,
      logo = {
        src: "",
      },
    },
  } = useThemeConfig();
  const { imageClassName, titleClassName, ...propsRest } = props;
  const logoLink = useBaseUrl(logo.href || "/");
  const isAbsLogoLink = logo.href?.startsWith("abs:");
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  return (
    <Link
      to={isAbsLogoLink ? "#" : logoLink}
      {...propsRest}
      {...(logo.target && {
        target: logo.target,
      })}
      {...(isAbsLogoLink && {
        onClick: () => {
          window.location.href = buildAbsoluteLink(logo.href);
        },
      })}
    >
      {logo.src && (
        <ThemedImage
          className={imageClassName}
          sources={sources}
          alt={logo.alt || navbarTitle || title}
        />
      )}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
};

export default Logo;
