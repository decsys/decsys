import React from "react";
import PropTypes from "prop-types";
import { Flex, Text, Grid, useColorMode, useTheme } from "@chakra-ui/core";
import { ActiveIndicator } from ".";
import LightHeading from "./LightHeading";

const ProgressCard = ({
  title,
  onClick,
  progressHeader,
  progressData,
  total,
  cardHeaderWidth,
}) => {
  const { colorMode } = useColorMode();
  const {
    sharedStyles: { card: style },
  } = useTheme();

  const missingDataCount = total - progressData.length;
  progressData = [...progressData, ...Array(missingDataCount).fill({})];

  return (
    <Grid
      onClick={onClick}
      {...style[colorMode]}
      templateColumns={`${cardHeaderWidth} 1fr`}
      alignItems="center"
      p={2}
      _hover={{ boxShadow: "callout", zIndex: 2 }}
    >
      <LightHeading p={2} as="h5" size="sm" textAlign="right">
        {title}
      </LightHeading>

      <Flex flexDirection="column">
        {progressHeader && <Text>{progressHeader}</Text>}
        <Flex alignItems="center" flexWrap="wrap">
          {progressData.map((x, i) => (
            <Flex key={i} m="0.1em">
              <ActiveIndicator
                active={x.complete}
                tooltips={{
                  [true]: "Complete",
                  [false]: "Incomplete",
                }}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Grid>
  );
};

ProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  progressHeader: PropTypes.string,
  progressData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      complete: PropTypes.bool,
    })
  ),
  total: PropTypes.number.isRequired,
};

ProgressCard.defaultProps = {
  onClick: () => {},
  progressData: [],
  cardHeaderWidth: "100px",
};

export default ProgressCard;
