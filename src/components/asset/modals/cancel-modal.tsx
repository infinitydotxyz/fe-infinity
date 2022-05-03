import React from 'react';
import { Modal } from 'src/components/common';

export const CancelModal: React.FC = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Cancel</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal} okButton="Confirm" onOKButton={() => console.log('hello')}>
        <div className="font-bold text-2xl tracking-tight mb-12">Cancel this listing?</div>
      </Modal>
    </div>
  );
};
