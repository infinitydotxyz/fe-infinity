import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components/common';
import { base64Encode, isLocalhost } from 'src/utils';
import { TextInputBox } from './input-box';

const LOCAL_STORAGE_KEY = 'ppp';
const base64Password = 'bmZ0ODg4'; // nft888 - can you find this easter egg?
const NO_PASSWORD_PAGES = ['/terms', '/privacy'];

export const isPasswordModalNeeded = () => {
  const str = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';
  if (location.pathname === '/' || NO_PASSWORD_PAGES.indexOf(location.pathname) >= 0) {
    // don't show for Home page / and excluded pages.
    return false;
  }
  if (!isLocalhost() && str !== base64Password) {
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
  const [isValidPassword, setIsValidPassword] = useState(true);

  useEffect(() => {
    if (base64Encode(password) === base64Password) {
      setIsValidPassword(true);
      localStorage.setItem(LOCAL_STORAGE_KEY, base64Encode(password));
      window.location.reload();
    } else {
      setIsValidPassword(false);
    }
  }, [password]);

  return (
    <Modal wide={false} isOpen={isOpen} onClose={onClose} okButton="Confirm" title="Password" showActionButtons={false}>
      <TextInputBox
        value={password}
        label=""
        type={'text'}
        placeholder=""
        className={isValidPassword ? '' : 'border-red-700'}
        onChange={(text) => setPassword(text)}
      />

      <div className="mt-6">
        <a target="_blank" href="https://www.premint.xyz/infinity-marketplace-v2-beta-allowlist/">
          No password? Join our <span className="underline">waitlist</span>
        </a>
      </div>
    </Modal>
  );
};
