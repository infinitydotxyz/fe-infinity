import React from 'react';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

interface Props {
  onClose: () => void;
}

export const UnstakeTokensModal = ({ onClose }: Props) => {
  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true}>
      <div>
        <div className="text-3xl font-medium">Unstake tokens</div>

        <div className="mt-12">
          <div className="text-lg mt-10 flex justify-between">
            <span>Balance</span>
            <span className="font-heading">4,000</span>
          </div>

          <div className="mt-10">
            <TextInputBox
              label=""
              value={''}
              type="text"
              onChange={() => console.log}
              placeholder="Enter amount to unstake"
              isFullWidth
              renderRightIcon={() => (
                <Button variant="gray" className="rounded-md py-1">
                  Max
                </Button>
              )}
            />
          </div>

          <div className="mt-4">Lock time remaining: 19 weeks</div>
        </div>

        <Button className="w-full py-3 mt-12">Unstake</Button>
      </div>
    </Modal>
  );
};
