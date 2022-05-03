import React from 'react';
import { Modal } from 'src/components/common';

export const CancelModal = () => {
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
      <Modal
        wide={false}
        isOpen={modalIsOpen}
        onClose={closeModal}
        okButton="Confirm"
        title="Cancel this listing?"
        onOKButton={() => console.log('hello')}
      />
    </div>
  );
};
