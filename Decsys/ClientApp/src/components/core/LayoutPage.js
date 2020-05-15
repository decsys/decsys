import React, { createContext, Children, useContext } from "react";
import useLocationStateToast from "hooks/useLocationStateToast";

const LayoutContext = createContext({ getLayout: () => "div" });

export const LayoutProvider = ({ children, layouts }) => {
  const getLayout = (layout = "default") => layouts[layout];

  return (
    <LayoutContext.Provider value={{ getLayout }}>
      {Children.only(children)}
    </LayoutContext.Provider>
  );
};

const useLayout = () => useContext(LayoutContext);

export const Page = ({ layout, ...p }) => {
  useLocationStateToast();
  const Layout = useLayout().getLayout(layout);
  return Layout != null ? <Layout {...p} /> : null;
};
