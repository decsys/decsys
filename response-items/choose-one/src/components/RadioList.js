import FlexBox from "./FlexBox";
import RadioListItem from "./RadioListItem";

const RadioList = ({ options, onSelection, ...props }) => {
  // Generate identifier to group radios
  const name = Date.now();

  return (
    <FlexBox>
      {options.map((option, i) => (
        <RadioListItem
          key={i}
          name={name}
          option={option}
          onSelection={onSelection}
          {...props}
        />
      ))}
    </FlexBox>
  );
};

export default RadioList;
