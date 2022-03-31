import React from 'react';
import { Button, Dialog } from 'src/components/common';

export const CancelModal: React.FC = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>Cancel</button>
      <Dialog isOpen={modalIsOpen} onClose={closeModal} hideActionButtons={false}>
        <div className="modal-body p-4 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-12">Cancel this listing?</p>
          <div className="flex">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              Confirm
            </Button>
            <Button className="flex-1 rounded-full" size="large" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
