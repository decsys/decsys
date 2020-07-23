import { createContext, useContext } from "react";

const UsersContext = createContext({});
export const useUsers = () => useContext(UsersContext);

export default UsersContext.Provider;
