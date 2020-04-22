import React from "react";
import { action } from "@storybook/addon-actions";
import { ExclamationTriangle, ArrowLeft } from "styled-icons/fa-solid";
import { Typography } from "@smooth-ui/core-sc";
import { ConfirmModal, FlexBox } from "components/core";

const modalState = {
  modalOpened: true,
  toggleModal: action("Modal toggled")
};

export default {
  title: "Core UI/ConfirmModal",
  component: ConfirmModal
};

export const Basic = () => <ConfirmModal {...modalState} />;

export const NoCancel = () => (
  <ConfirmModal {...modalState} cancelButton={false} header="Oops!">
    More information than confirmation, I guess.
  </ConfirmModal>
);

export const NoCloseButton = () => (
  <ConfirmModal {...modalState} showCloseButton={false} header="Oops!">
    More information than confirmation, I guess.
  </ConfirmModal>
);

export const CustomButtons = () => (
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
);
