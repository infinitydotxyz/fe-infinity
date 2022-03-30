import React from 'react';
import ReactModal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 24
  },
  overlay: {
    backdropFilter: 'blur(10px)'
  }
};

ReactModal.setAppElement('#__next');

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, children }: ModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
      {children}
    </ReactModal>
  );
};

export default Modal;
