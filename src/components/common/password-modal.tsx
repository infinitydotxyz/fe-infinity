import React, { useState } from 'react';
import { Modal } from 'src/components/common';
import { Base64, isLocalhost } from 'src/utils';
import { Button } from './button';
import { TextInputBox } from './input-box';

const LOCAL_STORAGE_KEY = 'ppp';
const PPP = 'nft888';

export const isPasswordModalNeeded = () => {
  const str = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';
  if (!isLocalhost() && Base64.decode(str) !== PPP) {
    // !isLocalhost() &&
    return true;
  }
  return false;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal = ({ isOpen, onClose }: Props) => {
  const [password, setPassword] = useState('');

  const onClickSubmit = () => {
    if (password === PPP) {
      localStorage.setItem(LOCAL_STORAGE_KEY, Base64.encode(password));
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

      <div className="mt-6">
        Request for password at{' '}
        <a href="https://discord.com/invite/infinitydotxyz">https://discord.com/invite/infinitydotxyz</a>
      </div>
    </Modal>
  );
};
