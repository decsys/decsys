import adminReducer from "./app/admin/_reducers";
import dataReducer from "./app/common/_reducers";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    admin: adminReducer,
    data: dataReducer
  });

export default rootReducer;
