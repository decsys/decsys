import React from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@smooth-ui/core-sc";
import { FlexBox, ActiveIndicator } from ".";

const ProgressCard = ({
  title,
  onClick,
  progressHeader,
  progressData = [],
  total
}) => {
  const missingDataCount = total - progressData.length;
  progressData = [...progressData, ...Array(missingDataCount).fill({})];

  return (
    <FlexBox
      p={1}
      alignItems="start"
      onClick={onClick}
      backgroundColor="cardBg"
      borderBottom="thin solid"
      borderColor="cardBorder"
    >
      <Typography variant="h5" mb="0.1em" mt={1} px={2}>
        {title}
      </Typography>

      <FlexBox flexDirection="column">
        {progressHeader && <Typography>{progressHeader}</Typography>}
        <FlexBox alignItems="center" flexWrap="wrap">
          {progressData.map((x, i) => (
            <Box key={i} m="0.1em">
              <ActiveIndicator
                active={x.complete}
                tooltips={{
                  [true]: "Complete",
                  [false]: "Incomplete"
                }}
              />
            </Box>
          ))}
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

ProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  progressHeader: PropTypes.string,
  progressData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      complete: PropTypes.bool
    })
  ),
  total: PropTypes.number.isRequired
};

export default ProgressCard;
