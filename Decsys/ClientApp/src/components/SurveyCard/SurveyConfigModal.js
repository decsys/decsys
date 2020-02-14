import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { ConfirmModal, FlexBox, LoadingIndicator } from "../ui";
import {
  Switch,
  Typography,
  Textarea,
  Input,
  Button
} from "@smooth-ui/core-sc";
import { InfoCircle } from "styled-icons/fa-solid";
import SurveyCardContext from "./Context";
import { generateCombination } from "gfycat-style-urls";
import { getCancelToken } from "../../api";

const InfoIcon = styled(InfoCircle)`
  color: ${({ theme }) => theme.info};
`;

const SurveyConfigModal = ({ surveyId, surveyName, modalState }) => {
  const { fetchSurveyConfig, handleSurveyConfigSaveClick } = useContext(
    SurveyCardContext
  );

  const [oneTimeParticipants, setOneTimeParticipants] = useState();
  const [useParticipantIdentifiers, setUseParticipantIdentifiers] = useState();
  const [validIdentifiers, setValidIdentifiers] = useState([]);
  const [currentConfigLoaded, setCurrentConfigLoaded] = useState();
  const [idGenCount, setIdGenCount] = useState(10);

  useEffect(() => {
    const token = getCancelToken();
    fetchSurveyConfig(surveyId, token)
      .then(({ data }) => {
        setOneTimeParticipants(data.oneTimeParticipants);
        setUseParticipantIdentifiers(data.useParticipantIdentifiers);
        setValidIdentifiers(data.validIdentifiers || []);
        setCurrentConfigLoaded(true);
      })
      .catch(e => {
        if (!e.isCancellation) throw e; // cancellations are fine
      });
    return () => token.cancel();
  }, [fetchSurveyConfig, surveyId]);

  const handleConfirmClick = async () => {
    await handleSurveyConfigSaveClick(surveyId, {
      oneTimeParticipants,
      useParticipantIdentifiers,
      validIdentifiers: validIdentifiers.filter(x => !!x)
    });
    modalState.toggleModal();
  };

  const handleGenCountChange = ({ target: { value } }) =>
    setIdGenCount(parseInt(value));

  const handleIdGenClick = () =>
    setValidIdentifiers([
      ...validIdentifiers,
      ...Array(idGenCount)
        .fill(() => generateCombination(1, "", true))
        .map(x => x())
    ]);

  return (
    <ConfirmModal
      forceUpdate={useParticipantIdentifiers}
      {...modalState}
      header={`Configure ${surveyName}`}
      confirmButton={{
        content: "Save",
        variant: "primary",
        onClick: handleConfirmClick
      }}
    >
      {(!currentConfigLoaded && <LoadingIndicator />) || (
        <FlexBox flexDirection="column">
          <FlexBox>
            <Switch
              checked={oneTimeParticipants}
              onChange={({ target: { checked } }) =>
                setOneTimeParticipants(checked)
              }
            />
            <Typography ml={1}>
              Restrict Participants to only taking the Survey once
            </Typography>
          </FlexBox>

          <FlexBox mt={2}>
            <Switch
              checked={useParticipantIdentifiers}
              onChange={({ target: { checked } }) =>
                setUseParticipantIdentifiers(checked)
              }
            />
            <Typography ml={1}>
              Require Participants to enter an identifier
            </Typography>
          </FlexBox>

          {useParticipantIdentifiers && (
            <>
              <Typography fontWeight="bold" mt={1}>
                Valid Participant Identifiers
              </Typography>

              <FlexBox alignItems="center" my={1} ml={2}>
                <InfoIcon size="2em" />
                <FlexBox flexDirection="column" ml={2}>
                  <Typography color="info">
                    • Restrict Survey access to only these Identifiers
                  </Typography>
                  <Typography color="info">
                    • One Identifier per line
                  </Typography>
                  <Typography color="info">
                    • Leave empty to require participants to enter a unique
                    identifier
                  </Typography>
                </FlexBox>
              </FlexBox>

              <FlexBox mb={1}>
                <Input
                  size="sm"
                  type="number"
                  value={idGenCount}
                  onChange={handleGenCountChange}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleIdGenClick}
                >
                  Generate Random IDs
                </Button>
              </FlexBox>

              <Textarea
                rows={6}
                value={validIdentifiers.join("\n")}
                onChange={({ target: { value } }) =>
                  setValidIdentifiers(value.split("\n"))
                }
              />
            </>
          )}
        </FlexBox>
      )}
    </ConfirmModal>
  );
};

export default SurveyConfigModal;
