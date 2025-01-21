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
import { ExternalDetailsModal } from "../ExternalDetailsModal";
import { capitalise } from "services/strings";
import { SelectStudyModal } from "./SelectStudyModal";
import WebhookManagementController from "components/shared/Webhook/WebhookManagementController";
import { useState } from "react";

const ManageSurveyMenu = ({
  id,
  editable,
  name,
  type,
  settings,
  parentSurveyId,
  isStudy,
  hasInvalidExternalLink,
  runCount,
  activeInstanceId,
  currentArchiveDate,
  handleUnarchive,
  handleArchive,
  isFolder,
}) => {
  const [canChangeFolder, setCanChangeFolder] = useState(false);

  const deleteModal = useDisclosure();
  const configModal = useDisclosure();
  const exportModal = useDisclosure();
  const externalDetailsModal = useDisclosure();
  const createSurveyModal = useDisclosure();
  const selectStudyModal = useDisclosure();

  const { duplicate, deleteSurvey, navigate } = useSurveyCardActions();

  const handleDuplicate = (name, type, settings, creationOptions) => {
    duplicate(id, name, type, settings, creationOptions);
    createSurveyModal.onClose();
  };

  const handleDelete = async () => await deleteSurvey(id);

  const canChangeFolderSelect = () => {
    setCanChangeFolder(true);
    selectStudyModal.onOpen();
  };

  const changeStudySelect = () => {
    setCanChangeFolder(false);
    selectStudyModal.onOpen();
  };

  return (
    <>
      {!isFolder && (
        <>
          <Menu>
            <MenuButton
              border="thin solid"
              borderColor="gray.500"
              as={IconButton}
              icon={<FaEllipsisV />}
              boxSize={parentSurveyId ? "32px" : null}
            />
            <MenuList>
              {editable && (
                <MenuItem onClick={() => navigate(`/admin/surveys/${id}`)}>
                  Edit
                </MenuItem>
              )}

              {!type && !parentSurveyId && (
                <MenuItem onClick={configModal.onOpen}>Configure</MenuItem>
              )}

              {type && !parentSurveyId && (
                <MenuItem onClick={externalDetailsModal.onOpen}>
                  {capitalise(type)} Details
                </MenuItem>
              )}

              <MenuItem
                onClick={() => navigate(`/admin/surveys/${id}/preview`)}
              >
                Preview
              </MenuItem>

              {!isStudy && <WebhookManagementController surveyId={id} />}
              <MenuItem onClick={exportModal.onOpen}>Export</MenuItem>

              {!isStudy && editable && (
                <MenuItem onClick={changeStudySelect}>Change Study...</MenuItem>
              )}

              {!activeInstanceId && (
                <MenuItem onClick={canChangeFolderSelect}>
                  Add to a Folder...
                </MenuItem>
              )}

              <MenuItem onClick={createSurveyModal.onOpen}>Duplicate</MenuItem>

              {(editable || !parentSurveyId) && (
                <MenuItem onClick={deleteModal.onOpen}>Delete</MenuItem>
              )}
              {!activeInstanceId &&
                (currentArchiveDate ? (
                  <MenuItem onClick={handleUnarchive}>Unarchive</MenuItem>
                ) : (
                  <MenuItem onClick={handleArchive}>Archive</MenuItem>
                ))}
            </MenuList>
          </Menu>

          <DeleteSurveyModal
            name={name}
            onConfirm={handleDelete}
            modalState={deleteModal}
            isStudy={isStudy}
          />
          <SurveyConfigModal id={id} name={name} modalState={configModal} />
          <ExportModal id={id} name={name} modalState={exportModal} />
          <ExternalDetailsModal
            id={id}
            name={name}
            type={type}
            settings={settings}
            runCount={runCount}
            hasInvalidExternalLink={hasInvalidExternalLink}
            modalState={externalDetailsModal}
          />
          <CreateSurveyModal
            name={`${name} (Copy)`} // we always use this modal for duplicating only
            modalState={createSurveyModal}
            onCreate={handleDuplicate}
            parentId={parentSurveyId}
            isFixedType={!!parentSurveyId}
            hasFixedSettings={!!parentSurveyId}
          />
          <SelectStudyModal
            id={id}
            name={name}
            parentId={parentSurveyId}
            modalState={selectStudyModal}
            canChangeFolder={canChangeFolder}
          />
        </>
      )}
    </>
  );
};

export default ManageSurveyMenu;
