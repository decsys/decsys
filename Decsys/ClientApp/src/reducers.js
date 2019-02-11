import adminReducer from "./app/admin/_reducers";
import dataReducer from "./app/common/_reducers";

const rootReducer = {
  admin: adminReducer,
  data: dataReducer
};

export default rootReducer;
