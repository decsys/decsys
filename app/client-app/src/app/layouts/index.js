import Default from "./Default";
import { lazy } from "react";

const layouts = {
  default: Default,
  // LAZY load other layouts, but not default because our Suspense fallback uses it!
  preview: lazy(() => import("./Preview")),
  survey: lazy(() => import("./Survey")),
  results: lazy(() => import("./Results")),
};

export default layouts;
