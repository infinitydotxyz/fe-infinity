import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { CurrencyInput, toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { Modal } from '../common/modal';

export type TipModalProps = {
  /**
   * The address to send a tip to.
   */
  address: string;

  /**
   * Whether the modal is open.
   */
  isOpen: boolean;

  /**
   * Called when the modal is closed.
   */
  onClose: () => void;
};

export const TipModal: React.FC<TipModalProps> = ({ isOpen, onClose, address }) => {
  const [value, setValue] = useState('0.00');
  const [isTipping, setIsTipping] = useState(false);
  const { getSigner } = useOnboardContext();
  const tip = async (eth: string) => {
    const signer = getSigner();
    await signer?.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(eth)
    });
    onClose();
  };

  const onTip = async () => {
    if (isNaN(+value) || +value === 0) {
      toastError('Please enter a valid tip amount');
      return;
    }

    setIsTipping(true);

    try {
      await tip(value);
      setIsTipping(false);
      onClose();
      toastSuccess(`You tipped ${value} ETH towards this NFT collection.`);
    } catch (err) {
      console.error(err);
      setIsTipping(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <div className="text-3xl font-medium">Tip</div>

        <div className="mt-5">
          <p>Love this project? Send ETH to show your appreciation towards its developers and artists!</p>

          <div className="mt-5">
            <CurrencyInput
              autoFocus={true}
              label="Tip amount"
              currency="ETH"
              value={value?.toString()}
              onChange={(v) => setValue(v)}
              placeholder="Enter tip amount"
            />
          </div>
        </div>

        <Button size="large" disabled={isTipping} className="w-full py-3 mt-5" onClick={onTip}>
          Send tip
        </Button>
      </div>
    </Modal>
  );
};
