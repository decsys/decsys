import React from "react";
import ParamsEditor from "./ParamsEditor";
import ParamTypes from "@decsys/param-types";

const Component = ({ text }) => <div>{text}</div>;
Component.paramTypes = {
  numberMin: ParamTypes.integer({ min: 7 }),
  numberMax: ParamTypes.integer({ max: 20 }),
  numberRange: ParamTypes.integer({ min: 0, max: 100 }),
  stringLength: ParamTypes.string({ limit: 5 }),
  arrayLimit: ParamTypes.arrayOf(ParamTypes.string(), { limit: 3 }),
};

export default {
  title: "ParamsEditor",
  component: ParamsEditor,
  argTypes: {
    handleParamChange: { action: "changed" },
    paramTypes: { type: "object" },
  },
};

const Template = ({ paramTypes = {}, ...args }) => (
  <ParamsEditor component={{ ...Component.bind({}), paramTypes }} {...args} />
);

export const Basic = Template.bind({});
Basic.args = { paramTypes: Component.paramTypes };

export const Constructors = Template.bind({});
Constructors.args = {
  paramTypes: {
    text: ParamTypes.string({ default: "lol" }),
    isBoolean: ParamTypes.bool({ label: "Is Boolean?" }),
    howMany: ParamTypes.integer({
      label: "How Many?",
    }),
    chooseOne: ParamTypes.oneOf(["Ham", "Cheese"], {
      label: "Choose One",
    }),
  },
};

export const ObjectLiterals = Template.bind({});
ObjectLiterals.args = {
  paramTypes: {
    text: { type: "string", default: "lol" },
    isBoolean: { type: "bool", label: "Is Boolean?" },
    howMany: { type: "integer", label: "How Many?" },
    chooseOne: {
      type: "oneOf",
      validValues: ["Ham", "Cheese"],
      label: "Choose One",
    },
  },
};

export const OneSectionOnly = Template.bind({});
OneSectionOnly.args = {
  paramTypes: {
    "Section 1": {
      section1Param: ParamTypes.string(),
    },
  },
};

export const OneSectionPlusUnparented = Template.bind({});
OneSectionPlusUnparented.args = {
  paramTypes: {
    unparentedParam: ParamTypes.string(),
    ...OneSectionOnly.args.paramTypes,
  },
};

export const MultipleSections = Template.bind({});
MultipleSections.args = {
  paramTypes: {
    ...OneSectionOnly.args.paramTypes,
    "Section 2": {
      section2Param: ParamTypes.bool(),
    },
  },
};

export const MultipleSectionsPlusUnparented = Template.bind({});
MultipleSectionsPlusUnparented.args = {
  paramTypes: {
    unparentedParam: ParamTypes.string(),
    ...MultipleSections.args.paramTypes,
  },
};

export const Shapes = Template.bind({});
Shapes.args = {
  paramTypes: {
    param1: ParamTypes.string(),
    shape1: ParamTypes.shape(
      {
        shapeParam1: ParamTypes.string(),
        shapeParam2: ParamTypes.bool(),
      },
      {
        label: "Shape with Flat Paths",
        flatPaths: true,
      }
    ),
    shape2: ParamTypes.shape({
      shapeParam1: ParamTypes.integer({
        label: "Overridden Path",
        path: "overridden.path",
      }),
      subShape: ParamTypes.shape({
        subParam1: ParamTypes.oneOf(["Bread", "Water"], {
          default: "Bread",
          label: "Default Nested Path",
        }),
        subParamWithPath: ParamTypes.string({ path: "overridden.second" }),
      }),
    }),
  },
};

export const Arrays = Template.bind({});
Arrays.args = {
  paramTypes: {
    Primitives: {
      param1: ParamTypes.string(),
      strings: ParamTypes.arrayOf(ParamTypes.string()),
      numbers: ParamTypes.arrayOf(ParamTypes.integer()),
      bools: ParamTypes.arrayOf(ParamTypes.bool()),
      oneOfs: ParamTypes.arrayOf(
        ParamTypes.oneOf(["Horse", "Duck"], {
          label: "Animal",
          default: "Horse",
        })
      ),
    },

    shapes: ParamTypes.arrayOf(
      ParamTypes.shape(
        {
          param: ParamTypes.string(),
          subShapeWithPath: ParamTypes.shape({
            subParam: ParamTypes.integer(),
            paramWithPath: ParamTypes.string({
              path: "path.should.not.be.nested",
            }),
          }),
          flatPathSubShape: ParamTypes.shape(
            {
              string: ParamTypes.string(),
            },
            { flatPaths: true }
          ),
        },
        { label: "ShapeWithPath", path: "path.should.be.ignored" }
      )
    ),

    flatPathShapes: ParamTypes.arrayOf(
      ParamTypes.shape(
        {
          string: ParamTypes.string(),
        },
        { flatPaths: true }
      )
    ),

    shapesWithArrays: ParamTypes.arrayOf(
      ParamTypes.shape({
        string: ParamTypes.string({ path: "yes" }),
        strings: ParamTypes.arrayOf(ParamTypes.string(), { path: "lol" }),
      }),
      { path: "shapesWithArraysAndPath" }
    ),
    nestedArraysWithNestedShapes: ParamTypes.arrayOf(
      ParamTypes.arrayOf(
        ParamTypes.arrayOf(
          ParamTypes.shape({
            subShape: ParamTypes.shape({ string: ParamTypes.string() }),
          })
        )
      )
    ),
  },
};

export const WithInfo = Template.bind({});
WithInfo.args = {
  paramTypes: {
    withTooltip: ParamTypes.string({ info: "Some kind of text parameter" }),
    shapeTooltips: ParamTypes.shape(
      {
        child: ParamTypes.string({ info: "the child" }),
        noTooltip: ParamTypes.string(),
      },
      { info: "The shape" }
    ),
    arrayTooltips: ParamTypes.arrayOf(ParamTypes.string({ info: "a child" }), {
      info: "the array",
    }),
  },
};

export const ColorPicker = Template.bind({});
ColorPicker.args = {
  paramTypes: {
    colors: ParamTypes.arrayOf(ParamTypes.color()),
  },
};
