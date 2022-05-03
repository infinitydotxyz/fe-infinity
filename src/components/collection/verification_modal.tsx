import React from 'react';
import { Modal } from 'src/components/common';

interface Props {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const VerificationModal = ({ isOpen, onSubmit, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onOKButton={onSubmit} onClose={onClose}>
      <div className="modal-body p-4 rounded-3xl">
        <p className="font-bold text-2xl tracking-tight">
          You need to verify that you are authorized to modify this collection.
        </p>
      </div>
    </Modal>
  );
};
