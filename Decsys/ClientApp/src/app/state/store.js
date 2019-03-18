import { configureStore, combineReducers } from "redux-starter-kit";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunkMiddleware from "redux-thunk";
import * as reducers from "./ducks";

const configure = history => {
  const rootReducer = combineReducers({
    ...reducers,
    router: connectRouter(history)
  });

  const middleware = [routerMiddleware(history), thunkMiddleware];

  return configureStore({ reducer: rootReducer, middleware });
};

export default configure;
