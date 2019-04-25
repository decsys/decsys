import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { ConfirmModal, FlexBox, LoadingIndicator } from "../ui";
import { Switch, Typography, Textarea } from "@smooth-ui/core-sc";
import { InfoCircle } from "styled-icons/fa-solid";
import SurveyCardContext from "./Context";

const SurveyConfigModal = ({ surveyId, surveyName, modalState }) => {
  const InfoIcon = styled(InfoCircle)`
    color: ${({ theme }) => theme.info};
  `;

  const { fetchSurveyConfig, handleSurveyConfigSaveClick } = useContext(
    SurveyCardContext
  );

  const [oneTimeParticipants, setOneTimeParticipants] = useState();
  const [useParticipantIdentifiers, setUseParticipantIdentifiers] = useState();
  const [validIdentifiers, setValidIdentifiers] = useState([]);
  const [currentConfigLoaded, setCurrentConfigLoaded] = useState();

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSurveyConfig(surveyId);
      setOneTimeParticipants(data.oneTimeParticipants);
      setUseParticipantIdentifiers(data.useParticipantIdentifiers);
      setValidIdentifiers(data.validIdentifiers || []);
      setCurrentConfigLoaded(true);
    };
    getData();
  }, []);

  const handleConfirmClick = async () => {
    await handleSurveyConfigSaveClick(surveyId, {
      oneTimeParticipants,
      useParticipantIdentifiers,
      validIdentifiers
    });
    modalState.toggleModal();
  };

  return (
    <ConfirmModal
      forceUpdate={useParticipantIdentifiers}
      {...modalState}
      header={`Configure ${surveyName}`}
      confirmButtonLabel="Save"
      confirmButtonVariant="primary"
      onConfirmClick={handleConfirmClick}
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
                    • Leave empty to allow anyone to take part
                  </Typography>
                </FlexBox>
              </FlexBox>
              <Textarea
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
