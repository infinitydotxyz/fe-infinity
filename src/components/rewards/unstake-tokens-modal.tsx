import React, { useState } from 'react';
import { useRemainingLockTime } from 'src/hooks/contract/staker/useRemainingLockTime';
import { useTotalStaked } from 'src/hooks/contract/staker/useTotalStaked';
import { useUnstake } from 'src/hooks/contract/staker/useUnstake';
import { toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

interface Props {
  onClose: () => void;
}

export const UnstakeTokensModal = ({ onClose }: Props) => {
  const { balance } = useTotalStaked();
  const [value, setValue] = useState(0);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const { weeks } = useRemainingLockTime();
  const { unstake } = useUnstake();

  const onUnstake = async () => {
    if (value === 0) {
      toastError('Please enter a valid unstake amount');
      return;
    }

    setIsUnstaking(true);

    try {
      await unstake(value);
      setIsUnstaking(false);
      onClose();
      toastSuccess('Unstake successfull, change in tokens will reflect shortly.');
    } catch (err) {
      console.error(err);
      setIsUnstaking(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <div className="text-3xl font-medium">Unstake tokens</div>

        <div className="mt-12">
          <div className="text-lg mt-10 flex justify-between">
            <span>Total staked</span>
            <span className="font-heading">{balance || 0}</span>
          </div>

          <div className="mt-10">
            <TextInputBox
              label=""
              value={value?.toString()}
              type="text"
              onChange={(v) => !isNaN(+v) && +v <= balance && setValue(+v)}
              placeholder="Enter amount to unstake"
              isFullWidth
              renderRightIcon={() => (
                <Button variant="gray" className="rounded-full py-2 px-3" onClick={() => setValue(balance)}>
                  Max
                </Button>
              )}
            />
          </div>

          <div className="mt-4">Lock time remaining: {weeks} weeks</div>
        </div>

        <Button disabled={isUnstaking} className="w-full py-3 mt-12" onClick={onUnstake}>
          Unstake
        </Button>
      </div>
    </Modal>
  );
};
