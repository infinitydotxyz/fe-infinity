import React from 'react';
import { Modal } from 'src/components/common';

interface Props {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const VerificationModal = ({ isOpen, onSubmit, onClose }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onOKButton={onSubmit}
      onClose={onClose}
      title="Verify"
      message="You need to verify that you are authorized to modify this collection."
    />
  );
};
