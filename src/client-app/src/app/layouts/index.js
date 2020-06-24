import Default from "./Default";

const layouts = {
  default: Default
  // LAZY load other layouts, but not default because our Suspense fallback uses it!
};

export default layouts;
