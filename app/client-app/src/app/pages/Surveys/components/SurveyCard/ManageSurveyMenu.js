import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import DeleteSurveyModal from "../../../../../components/shared/DeleteSurveyModal";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import SurveyConfigModal from "../SurveyConfigModal";
import ExportModal from "components/shared/ExportModal";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";

const ManageSurveyMenu = ({ id, editable, name }) => {
  const deleteModal = useDisclosure();
  const configModal = useDisclosure();
  const exportModal = useDisclosure();
  const createSurveyModal = useDisclosure();

  const { duplicate, deleteSurvey, navigate } = useSurveyCardActions();
  const handleDuplicate = (name, type, settings) => {
    duplicate(id, name, type, settings);
    createSurveyModal.onClose();
  };
  const handleDelete = () => deleteSurvey(id);

  return (
    <>
      <Menu>
        <MenuButton
          border="thin solid"
          borderColor="gray.500"
          as={IconButton}
          icon={<FaEllipsisV />}
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
          <MenuItem onClick={createSurveyModal.onOpen}>Duplicate</MenuItem>
          <MenuItem onClick={deleteModal.onOpen}>Delete</MenuItem>
        </MenuList>
      </Menu>

      <DeleteSurveyModal
        name={name}
        onConfirm={handleDelete}
        modalState={deleteModal}
      />
      <SurveyConfigModal id={id} name={name} modalState={configModal} />
      <ExportModal id={id} name={name} modalState={exportModal} />
      <CreateSurveyModal
        name={`${name} (Copy)`} // we always use this modal for duplicating only
        modalState={createSurveyModal}
        onCreate={handleDuplicate}
      />
    </>
  );
};

export default ManageSurveyMenu;
