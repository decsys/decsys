// global React, ReactDOM

// Component Metadata
const name = "FreeText";
const version = "0.1.0";
// TODO: Schema?

// Build a React component for our FreeText question type
const FreeText = props => {
  const threshold = props.maxLength / 10; // right now we fix this at 10% MaxLength

  // these become references to elements when the component is rendered
  let message, counter, ta;

  // Input handler to update the shiny character limit counter
  const handleInput = e => {
    const count = props.maxLength - ta.value.length;
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
  return React.createElement(
    "div",
    { className: "form-group" },
    React.createElement(
      "div",
      {
        className: "badge badge-info mb-1",
        ref: function ref(e) {
          return (message = e);
        }
      },
      React.createElement("span", { className: "fas fa-fw fa-info-circle" }),
      React.createElement(InfoCircle, { size: "1em" }),
      "Characters remaining\xA0",
      React.createElement(
        "span",
        {
          ref: function ref(e) {
            return (counter = e);
          }
        },
        props.maxLength - props.initialText.length
      ),
      "/",
      props.maxLength
    ),
    React.createElement("textarea", {
      className: "form-control",
      name: "FreeText",
      maxLength: props.maxLength,
      defaultValue: props.initialText,
      ref: function ref(e) {
        return (ta = e);
      },
      onInput: handleInput
    })
  );
};

export { name };
export default FreeText;

//// FreeText enables submit immediately
//// since empty text is a valid input, for now...
//templateViewModel.enableSubmit();

// Render our React component!
//ReactDOM.render(
//    React.createElement(decsys.Components.FreeText, {
//        maxLength: templateViewModel.Params.MaxLength,
//        initialText: templateViewModel.Results.FreeText || ""
//    }),
//    templateViewModel.componentContainer
//);
