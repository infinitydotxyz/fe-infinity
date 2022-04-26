import React from 'react';
import { Button, SimpleModal, SimpleModalProps } from 'src/components/common';

export const VerificationModal: React.FC<Omit<SimpleModalProps, 'children'>> = (props) => {
  return (
    <SimpleModal {...props} showActionButtons={false}>
      <div className="modal-body p-4 rounded-3xl">
        <p className="font-bold text-2xl tracking-tight mb-12">
          You need to verify that you are authorized to modify this collection.
        </p>
        <div className="flex">
          <Button className="flex-1 mr-4 rounded-full" size="large" onClick={props.onSubmit}>
            Verify
          </Button>
          <Button className="flex-1 rounded-full" size="large" variant="outline" onClick={props.onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
};
