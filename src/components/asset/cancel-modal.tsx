import React from 'react';
import { Modal } from 'src/components/common/modal';
import { Button } from '../common';

const CancelModal: React.FC = () => {
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
      <Modal isOpen={modalIsOpen} onClose={closeModal} hideActionButtons={false}>
        <div className="modal-body p-4 lg:p-12 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-5">Cancel this listing?</p>
          <div className="flex">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              Confirm
            </Button>
            <Button className="flex-1 rounded-full" size="large" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelModal;
