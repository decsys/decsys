const DecsysComponent = (function(exports, React, PropTypes, styled) {
  "use strict";

  var React__default = "default" in React ? React["default"] : React;
  PropTypes =
    PropTypes && PropTypes.hasOwnProperty("default")
      ? PropTypes["default"]
      : PropTypes;
  styled =
    styled && styled.hasOwnProperty("default") ? styled["default"] : styled;

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

  var __assign = function() {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  }

  function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  }

  function memoize(fn) {
    var cache = {};
    return function(arg) {
      if (cache[arg] === undefined) cache[arg] = fn(arg);
      return cache[arg];
    };
  }

  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

  var index = memoize(
    function(prop) {
      return (
        reactPropsRegex.test(prop) ||
        (prop.charCodeAt(0) === 111 &&
          /* o */
          prop.charCodeAt(1) === 110 &&
          /* n */
          prop.charCodeAt(2) < 91)
      );
    }
    /* Z+1 */
  );

  function isValidProp(key) {
    return index(key);
  }
  function filterSVGProps(props) {
    return Object.keys(props).reduce(function(p, k) {
      if (isValidProp(k)) {
        p[k] = props[k];
      }
      return p;
    }, {});
  }
  var StyledIconBaseBase = React.forwardRef(function(props, ref) {
    var children = props.children,
      iconAttrs = props.iconAttrs,
      iconVerticalAlign = props.iconVerticalAlign,
      iconViewBox = props.iconViewBox,
      size = props.size,
      title = props.title,
      otherProps = __rest(props, [
        "children",
        "iconAttrs",
        "iconVerticalAlign",
        "iconViewBox",
        "size",
        "title"
      ]);
    var iconProps = __assign(
      {
        viewBox: iconViewBox,
        height: props.height !== undefined ? props.height : size,
        width: props.width !== undefined ? props.width : size,
        // @ts-ignore - aria is not always defined on SVG in React TypeScript types
        "aria-hidden": title == null ? "true" : undefined,
        focusable: "false",
        role: title != null ? "img" : undefined
      },
      iconAttrs
    );
    var svgProps = filterSVGProps(otherProps);
    return React.createElement(
      "svg",
      __assign({}, iconProps, svgProps, { ref: ref }),
      title && React.createElement("title", { key: "icon-title" }, title),
      children
    );
  });
  var StyledIconBase = styled(StyledIconBaseBase).withConfig({
    displayName: "StyledIconBase",
    componentId: "sc-bdy9j4"
  })(
    templateObject_1 ||
      (templateObject_1 = __makeTemplateObject(
        [
          "\n  display: inline-block;\n  vertical-align: ",
          ";\n  overflow: hidden;\n"
        ],
        [
          "\n  display: inline-block;\n  vertical-align: ",
          ";\n  overflow: hidden;\n"
        ]
      )),
    function(props) {
      return props.iconVerticalAlign;
    }
  );
  var templateObject_1;

  var InfoCircle = React.forwardRef(function(props, ref) {
    var attrs = {
      fill: "currentColor"
    };
    return React.createElement(
      StyledIconBase,
      __assign(
        {
          iconAttrs: attrs,
          iconVerticalAlign: "-.125em",
          iconViewBox: "0 0 512 512"
        },
        props,
        { ref: ref }
      ),
      React.createElement("path", {
        fill: "currentColor",
        d:
          "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z",
        key: "k0"
      })
    );
  });
  InfoCircle.displayName = "InfoCircle";

  // Component Metadata
  const name = "FreeText";
  // TODO: Schema?

  // Build a React component for our FreeText question type
  const FreeText = ({ maxLength, initialText }) => {
    const threshold = maxLength / 10; // right now we fix this at 10% MaxLength

    // these become references to elements when the component is rendered
    let message, counter, ta;

    // Input handler to update the shiny character limit counter
    const handleInput = e => {
      const count = maxLength - ta.value.length;
      counter.innerHTML = count;
      if (count === 0) {
        message.classList.remove("badge-warning");
        message.classList.remove("badge-info");
        message.classList.add("badge-danger");
      } else if (count <= threshold) {
        message.classList.remove("badge-info");
        message.classList.remove("badge-danger");
        message.classList.add("badge-warning");
      } else {
        message.classList.remove("badge-danger");
        message.classList.remove("badge-warning");
        message.classList.add("badge-info");
      }
    };

    // sadly we don't use JSX in here as this file doesn't go through babel :(
    return React__default.createElement(
      "div",
      { className: "form-group" },
      React__default.createElement(
        "div",
        {
          className: "badge badge-info mb-1",
          ref: function ref(e) {
            return (message = e);
          }
        },
        React__default.createElement("span", {
          className: "fas fa-fw fa-info-circle"
        }),
        React__default.createElement(InfoCircle, { size: "1em" }),
        "Characters remaining\xA0",
        React__default.createElement(
          "span",
          {
            ref: function ref(e) {
              return (counter = e);
            }
          },
          maxLength - initialText.length
        ),
        "/",
        maxLength
      ),
      React__default.createElement("textarea", {
        className: "form-control",
        name: "FreeText",
        maxLength: maxLength,
        defaultValue: initialText,
        ref: function ref(e) {
          return (ta = e);
        },
        onInput: handleInput
      })
    );
  };

  FreeText.propTypes = {
    initialText: PropTypes.string,
    maxLength: PropTypes.number
  };

  FreeText.defaultProps = {
    maxLength: 10,
    initialText: ""
  };

  exports.default = FreeText;
  exports.name = name;

  return exports;
})({}, React, PropTypes, styled);

export const name = DecsysComponent.name;
export default DecsysComponent.default;
