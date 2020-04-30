import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure
} from "@chakra-ui/core";
import { FaEllipsisV } from "react-icons/fa";
import DeleteSurveyModal from "./DeleteSurveyModal";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";

const ManageSurveyMenu = ({ id, editable, name }) => {
  const deleteModal = useDisclosure();
  const configModal = useDisclosure();
  const exportModal = useDisclosure();

  const { duplicate, deleteSurvey, navigate } = useSurveyCardActions();
  const handleDuplicate = () => duplicate(id);
  const handleDelete = () => deleteSurvey(id);

  return (
    <>
      <Menu>
        <MenuButton
          border="thin solid"
          borderColor="gray.500"
          as={IconButton}
          icon={FaEllipsisV}
        />
        <MenuList>
          {editable && (
            <MenuItem onClick={() => navigate(`survey/${id}`)}>Edit</MenuItem>
          )}
          <MenuItem onClick={configModal.onOpen}>Configure</MenuItem>
          <MenuItem onClick={() => navigate(`survey/${id}/preview`)}>
            Preview
          </MenuItem>
          <MenuItem onClick={exportModal.onOpen}>Export</MenuItem>
          <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
          <MenuItem onClick={deleteModal.onOpen}>Delete</MenuItem>
        </MenuList>
      </Menu>

      <DeleteSurveyModal
        name={name}
        onConfirm={handleDelete}
        modalState={deleteModal}
      />
      {/* <SurveyConfigModal
        surveyId={id}
        surveyName={name}
        modalState={configModal}
      />
      <ExportModal survey={{ id, name }} modalState={exportModal} /> */}
    </>
  );
};

export default ManageSurveyMenu;
