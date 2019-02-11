import adminReducer from "./app/admin/_reducers";
import dataReducer from "./app/common/_reducers";

const rootReducer = (state = {}, action) => {
  // we always update the data state first before any app/ui state
  const data = dataReducer(state.data, action);

  // any data dependent reducer calls can now occur
  return {
    admin: adminReducer(state.admin, action, state.data),
    data: data
  };
};

export default rootReducer;
