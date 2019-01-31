import { combineReducers } from "redux";
import * as Types from "./_types";

const sortReducer = (state = { key: "active", name: true }, action) => {
  switch (action.type) {
    case Types.SORT:
      return {
        ...state,
        key: action.key,
        [action.key]: action.asc
      };
    default:
      return state;
  }
};

const surveysReducer = combineReducers({
  sort: sortReducer
});

export default surveysReducer;
