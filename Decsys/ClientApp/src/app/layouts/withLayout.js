import React, { Suspense } from "react";
import LoadingScreen from "app/screens/LoadingScreen";
import Default from "./Default";

const layouts = {
  default: Default
  // LAZY load other layouts, but not default because our Suspense fallback uses it!
};

/**
 * Higher Order Component
 * for putting a Component inside a Layout
 * @param {*} Component
 * @param {string} [layout]
 */
const withLayout = (Component, layout = "default") => {
  const Layout = layouts[layout];

  return p => (
    <Suspense fallback={<LoadingScreen />}>
      <Layout>
        <Component {...p} />
      </Layout>
    </Suspense>
  );
};

export default withLayout;
