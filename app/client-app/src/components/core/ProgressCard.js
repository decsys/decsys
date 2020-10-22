import React from "react";
import PropTypes from "prop-types";
import { Flex, Text, Grid, useColorMode, useTheme } from "@chakra-ui/core";
import { ActiveIndicator } from ".";
import LightHeading from "./LightHeading";
import { defaultColorMode } from "themes";

const ProgressCard = ({
  title,
  onClick,
  progressHeader,
  progressData,
  total,
  cardHeaderWidth,
  message = null,
  lowProfile = false,
}) => {
  const { colorMode } = useColorMode();
  const {
    sharedStyles: { card: style },
  } = useTheme();

  const missingDataCount = !total ? 0 : total - progressData.length;
  progressData = !missingDataCount
    ? progressData
    : [...progressData, ...Array(missingDataCount).fill({})];

  return (
    <Grid
      onClick={onClick}
      {...style[colorMode || defaultColorMode]}
      templateColumns={`${cardHeaderWidth} 1fr`}
      alignItems="center"
      p={lowProfile ? 0 : 2}
      _hover={lowProfile ? null : { boxShadow: "callout", zIndex: 2 }}
    >
      <LightHeading
        p={lowProfile ? 1 : 2}
        as="h5"
        size={lowProfile ? "xs" : "sm"}
        textAlign="right"
      >
        {title}
      </LightHeading>

      {message ? (
        <Flex p={1}>
          <Text>{message}</Text>
        </Flex>
      ) : (
        <Flex flexDirection="column">
          {progressHeader && <Text>{progressHeader}</Text>}
          <Flex alignItems="center" flexWrap="wrap">
            {progressData.map((x, i) => (
              <Flex key={i} m="0.1em">
                <ActiveIndicator
                  p={lowProfile ? 0.5 : 2}
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
      )}
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
  total: PropTypes.number,
};

ProgressCard.defaultProps = {
  onClick: () => {},
  progressData: [],
  cardHeaderWidth: "100px",
};

export default ProgressCard;
