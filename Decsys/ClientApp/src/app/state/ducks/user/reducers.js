import * as types from "./types";

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_USER_ID:
      const { id } = action.payload;
      return {
        ...state,
        id
      };
    default:
      return state;
  }
};

export default userReducer;
