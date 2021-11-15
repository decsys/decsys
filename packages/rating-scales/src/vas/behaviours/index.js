import * as SpeirsBridge2010 from "./speirs-bridge-2010";
import * as HeskethPryorHesketh1988 from "./hesketh-pryor-hesketh-1988";

// Define swappable behaviours for MVAS
// An MVAS behaviour must export 2 functions: getInitialState and getUpdatedState

export const behaviour = {
  SpeirsBridge2010: "SpeirsBridge2010",
  HeskethPryorHesketh1988: "HeskethPryorHesketh1988",
};

export const behaviours = {
  SpeirsBridge2010: SpeirsBridge2010,
  HeskethPryorHesketh1988: HeskethPryorHesketh1988,
};

