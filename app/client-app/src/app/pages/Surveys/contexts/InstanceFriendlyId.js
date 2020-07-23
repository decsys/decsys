import { createContext, useContext } from "react";

const InstanceFriendlyIdContext = createContext({});

export const useInstanceFriendlyId = () =>
  useContext(InstanceFriendlyIdContext);

export const InstanceFriendlyIdProvider = InstanceFriendlyIdContext.Provider;
