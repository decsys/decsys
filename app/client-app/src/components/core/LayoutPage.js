import React, { createContext, Children, useContext } from "react";
import useLocationStateToast from "hooks/useLocationStateToast";

const LayoutContext = createContext({ getLayout: () => "div" });

export const LayoutProvider = ({ children, layouts }) => {
  const getLayout = (layout = "default") => layout && layouts[layout];

  return (
    <LayoutContext.Provider value={{ getLayout }}>
      {Children.only(children)}
    </LayoutContext.Provider>
  );
};

const useLayout = () => useContext(LayoutContext);

export const Page = ({ layout, toastDefaults = { position: "top" }, ...p }) => {
  useLocationStateToast(toastDefaults);
  const Layout = useLayout().getLayout(layout);
  return Layout != null ? <Layout {...p} /> : p.children || null;
};
