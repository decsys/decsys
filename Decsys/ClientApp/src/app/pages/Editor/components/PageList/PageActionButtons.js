import React from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import { FaTrash, FaCopy, FaPlus, FaRandom } from "react-icons/fa";
import { DotHoverIconButton } from "components/core";
import { usePageListActions } from "../../contexts/PageListActions";

const PageActionButtons = ({ id, isPageHovered }) => {
  const { deletePage } = usePageListActions();
  return (
    <Flex>
      <IconButton variantColor="blue" icon={FaRandom} />

      <DotHoverIconButton
        isHovered={isPageHovered}
        variantColor="green"
        icon={FaPlus}
      />

      <DotHoverIconButton isHovered={isPageHovered} icon={FaCopy} />

      <DotHoverIconButton
        isHovered={isPageHovered}
        variantColor="red"
        icon={FaTrash}
        onClick={() => deletePage(id)}
      />
    </Flex>
  );
};

export default PageActionButtons;
