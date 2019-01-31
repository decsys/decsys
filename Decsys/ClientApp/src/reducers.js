import { combineReducers } from "redux";
import adminReducer from "./app/admin/_reducers";
import dataReducer from "./app/common/_reducers";

const rootReducer = combineReducers({
  admin: adminReducer,
  data: dataReducer
});

export default rootReducer;
