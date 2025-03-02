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
import DeleteFolderModal from "../../../../../components/shared/DeleteFolderModal";
import { useSurveyCardActions } from "../../contexts/SurveyCardActions";
import SurveyConfigModal from "../SurveyConfigModal";
import ExportModal from "components/shared/ExportModal";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import { ExternalDetailsModal } from "../ExternalDetailsModal";
import { capitalise } from "services/strings";
import { SelectSurveyItemModal } from "./SelectSurveyItemModal";
import WebhookManagementController from "components/shared/Webhook/WebhookManagementController";
import { useState } from "react";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";

const ManageSurveyMenu = ({
  id,
  editable,
  name,
  type,
  surveyCount,
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
  parentFolderName,
}) => {
  const { mode } = useServerConfig();

  const [canChangeFolder, setCanChangeFolder] = useState(false);
  const deleteModal = useDisclosure();
  const deleteFolderModal = useDisclosure();
  const configModal = useDisclosure();
  const exportModal = useDisclosure();
  const externalDetailsModal = useDisclosure();
  const createSurveyModal = useDisclosure();
  const selectSurveyItemModal = useDisclosure();

  const { duplicate, deleteSurvey, navigate, deleteFolder } =
    useSurveyCardActions();

  const handleDuplicate = (
    name,
    type,
    settings,
    creationOptions,
    parentFolderName
  ) => {
    duplicate(id, name, type, settings, creationOptions, parentFolderName);
    createSurveyModal.onClose();
  };

  const handleDelete = async () => await deleteSurvey(id);
  const handleFolderDelete = async () => await deleteFolder(name);

  const canChangeFolderSelect = () => {
    setCanChangeFolder(true);
    selectSurveyItemModal.onOpen();
  };

  const changeStudySelect = () => {
    setCanChangeFolder(false);
    selectSurveyItemModal.onOpen();
  };

  return (
    <>
      <>
        <Menu>
          <MenuButton
            border="thin solid"
            borderColor="gray.500"
            as={IconButton}
            icon={<FaEllipsisV />}
            boxSize={parentSurveyId ? "32px" : null}
            width="40px"
          />
          <MenuList>
            {isFolder && (
              <MenuItem onClick={() => navigate(`/admin/folders/${name}`)}>
                View
              </MenuItem>
            )}
            {isFolder && (
              <MenuItem onClick={deleteFolderModal.onOpen}>Delete</MenuItem>
            )}

            {!isFolder && (
              <>
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

                {!isStudy && mode !== WORKSHOP && (
                  <WebhookManagementController surveyId={id} />
                )}
                <MenuItem onClick={exportModal.onOpen}>Export</MenuItem>

                {!isStudy && editable && (
                  <MenuItem onClick={changeStudySelect}>
                    Change Study...
                  </MenuItem>
                )}
                {!activeInstanceId && (
                  <MenuItem onClick={canChangeFolderSelect}>
                    {parentFolderName
                      ? "Change Folder..."
                      : "Add to a Folder..."}
                  </MenuItem>
                )}

                <MenuItem onClick={createSurveyModal.onOpen}>
                  Duplicate
                </MenuItem>

                {(editable || !parentSurveyId) && (
                  <MenuItem onClick={deleteModal.onOpen}>Delete</MenuItem>
                )}

                {!activeInstanceId &&
                  (currentArchiveDate ? (
                    <MenuItem onClick={handleUnarchive}>Unarchive</MenuItem>
                  ) : (
                    <MenuItem onClick={handleArchive}>Archive</MenuItem>
                  ))}
              </>
            )}
          </MenuList>
        </Menu>

        <DeleteFolderModal
          name={name}
          onConfirm={handleFolderDelete}
          modalState={deleteFolderModal}
          surveyCount={surveyCount}
        />
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
          parentFolderName={parentFolderName}
        />
        <SelectSurveyItemModal
          id={id}
          name={name}
          parentId={parentSurveyId}
          modalState={selectSurveyItemModal}
          canChangeFolder={canChangeFolder}
          parentFolderName={parentFolderName}
        />
      </>
    </>
  );
};

export default ManageSurveyMenu;
