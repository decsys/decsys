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
import WebhookListModal from "components/shared/Webhook/WebhookListModal";
import { useWebhook } from "api/webhooks";
import { useState } from "react";
import WebhookManagementController from "components/shared/Webhook/WebhookManagementController";
import { useToast } from "@chakra-ui/react";

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
}) => {
  const deleteModal = useDisclosure();
  const configModal = useDisclosure();
  const exportModal = useDisclosure();
  const externalDetailsModal = useDisclosure();
  const createSurveyModal = useDisclosure();
  const selectStudyModal = useDisclosure();
  const WebhookListModal = useDisclosure();

  const { duplicate, deleteSurvey, navigate } = useSurveyCardActions();

  const handleDuplicate = (name, type, settings, creationOptions) => {
    duplicate(id, name, type, settings, creationOptions);
    createSurveyModal.onClose();
  };

  const handleDelete = async () => await deleteSurvey(id);

  return (
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

          <MenuItem onClick={() => navigate(`/admin/surveys/${id}/preview`)}>
            Preview
          </MenuItem>

          <WebhookManagementController surveyId={id} />
          <MenuItem onClick={exportModal.onOpen}>Export</MenuItem>

          {!isStudy && editable && (
            <MenuItem onClick={selectStudyModal.onOpen}>
              Change Study...
            </MenuItem>
          )}

          <MenuItem onClick={createSurveyModal.onOpen}>Duplicate</MenuItem>

          {(editable || !parentSurveyId) && (
            <MenuItem onClick={deleteModal.onOpen}>Delete</MenuItem>
          )}
          {!!!activeInstanceId &&
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
        name={name}
        id={id}
        parentId={parentSurveyId}
        modalState={selectStudyModal}
      />
    </>
  );
};

export default ManageSurveyMenu;
