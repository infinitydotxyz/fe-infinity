import { Collection, Token } from '@infinityxyz/lib-frontend/types/core';
import React from 'react';
import { Modal } from 'src/components/common';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const CancelModal = ({ isOpen, onClose, collection, token }: Props) => {
  return (
    <Modal
      wide={false}
      isOpen={isOpen}
      onClose={onClose}
      okButton="Confirm"
      title="Cancel this listing?"
      onOKButton={() => {
        console.log(collection);
        console.log(token);
      }}
    />
  );
};
