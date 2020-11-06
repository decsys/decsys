import React from "react";
import { get } from "lodash-es";
import { ParamControlRow } from "./ParamControls/ParamControlRow";
import { ShapeControls } from "./ParamControls/ShapeControls";
import { getNodePath, reduceParamTypes, types } from "@decsys/param-types";

export const buildControls = (namespace, key, node, _context) => {
  if (_context.namespace) {
    return {
      ...namespace,
      [key]: reduceParamTypes(node, buildControls, {
        ..._context,
        namespace: undefined,
      }),
      controls: namespace.controls ?? [],
    };
  }
  const nodePath = getNodePath(key, node, _context.parent);

  let control;
  switch (node.type) {
    case types.shape:
      control = (
        <ShapeControls
          key={key}
          paramKey={key}
          paramType={node}
          propPath={nodePath}
          _context={_context}
        />
      );
      break;
    default:
      control = (
        <ParamControlRow
          key={key}
          paramKey={key}
          paramType={node}
          propPath={nodePath}
          value={get(_context.params, nodePath) ?? node.default}
          handleParamChange={_context.handleParamChange}
        />
      );
      break;
  }

  return {
    ...namespace,
    controls: [...(namespace.controls ?? []), control],
  };
};
