import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ConfirmModal from "./ConfirmModal";
import { ExclamationTriangle, ArrowLeft } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";
import { Typography } from "@smooth-ui/core-sc";

const modalState = {
  modalOpened: true,
  toggleModal: action("Modal toggled")
};

storiesOf("Common UI/ConfirmModal", module)
  .add("Default", () => <ConfirmModal {...modalState} />)
  .add("No Cancel", () => (
    <ConfirmModal {...modalState} cancelButton={false} header="Oops!">
      More information than confirmation, I guess.
    </ConfirmModal>
  ))
  .add("No CloseButton", () => (
    <ConfirmModal {...modalState} showCloseButton={false} header="Oops!">
      More information than confirmation, I guess.
    </ConfirmModal>
  ))
  .add("Custom Buttons", () => (
    <ConfirmModal
      header={
        <FlexBox alignItems="center" color="danger">
          <ExclamationTriangle size="1em" />
          <Typography ml={1}>Delete stuff?</Typography>
        </FlexBox>
      }
      {...modalState}
      cancelButton={{
        content: (
          <FlexBox alignItems="center">
            <ArrowLeft size="1em" />
            <Typography ml={1}>Go back</Typography>
          </FlexBox>
        ),
        variant: "success"
      }}
      confirmButton={{
        content: "Delete",
        variant: "danger",
        onClick: action("Delete clicked")
      }}
    >
      Are you sure?
    </ConfirmModal>
  ));
