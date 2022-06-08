import React, { useState } from 'react';
import { Modal } from 'src/components/common';
import { Base64 } from 'src/utils';
import { Button } from './button';
import { TextInputBox } from './input-box';

const PPP = 'nft888';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal = ({ isOpen, onClose }: Props) => {
  const [password, setPassword] = useState('');

  const str = localStorage.getItem('ppp') ?? '';
  if (Base64.decode(str) === PPP) {
    return null;
  }

  const onClickSubmit = () => {
    if (password === PPP) {
      localStorage.setItem('ppp', Base64.encode(password));
      window.location.reload();
    }
  };
  return (
    <Modal
      wide={false}
      isOpen={isOpen}
      onClose={onClose}
      okButton="Confirm"
      title="Please enter the password"
      showActionButtons={false}
    >
      <TextInputBox value="" label="" type={'text'} placeholder="" onChange={(text) => setPassword(text)} />

      <Button className="mt-6 w-32" onClick={onClickSubmit}>
        Submit
      </Button>
    </Modal>
  );
};
