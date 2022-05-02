import React from 'react';
import { Button, Modal } from 'src/components/common';

interface Props {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const VerificationModal = ({ isOpen, onSubmit, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onSubmit={onSubmit} onClose={onClose} showActionButtons={false}>
      <div className="modal-body p-4 rounded-3xl">
        <p className="font-bold text-2xl tracking-tight mb-12">
          You need to verify that you are authorized to modify this collection.
        </p>
        <div className="flex">
          <Button className="flex-1 mr-4 rounded-full" size="large" onClick={onSubmit}>
            Verify
          </Button>
          <Button className="flex-1 rounded-full" size="large" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
