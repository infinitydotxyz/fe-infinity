import { RadioGroup } from '@headlessui/react';
import { StakeDuration } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { useStakerStake } from 'src/hooks/contract/staker/useStakerStake';
import { useTokenAllowance } from 'src/hooks/contract/token/useTokenAllowance';
import { useTokenApprove } from 'src/hooks/contract/token/useTokenApprove';
import { useTokenBalance } from 'src/hooks/contract/token/useTokenBalance';
import { twMerge } from 'tailwind-merge';
import { Heading } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

interface Props {
  onClose: () => void;
}

export const StakeTokensModal = ({ onClose }: Props) => {
  const [stakeDuration, setStakeDuration] = useState(0);
  const [value, setValue] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const { balance } = useTokenBalance();
  const { stake } = useStakerStake();
  const { approve } = useTokenApprove();
  const { allowance } = useTokenAllowance();

  const onStake = async () => {
    setIsStaking(true);

    try {
      if (allowance < value) {
        await approve(value);
      }

      await stake(value, stakeDuration);

      setIsStaking(false);
      onClose(); // TODO: pass tokens staked back to prev. page and update UI so user doesn't need to reload page to see the result
    } catch (err) {
      console.error(err);
      setIsStaking(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <Heading className="text-3xl font-medium font-body">Stake tokens</Heading>

        <div className="mt-12">
          <div>
            <RadioGroup value={stakeDuration} onChange={setStakeDuration}>
              <RadioGroup.Label>Stake for:</RadioGroup.Label>
              <RadioButtonCard value={StakeDuration.X0} label="No commitment" description="Multiplier: 1x" />
              <RadioButtonCard value={StakeDuration.X3} label="3 months" description="Multiplier: 2x" />
              <RadioButtonCard value={StakeDuration.X6} label="6 months" description="Multiplier: 3x" />
              <RadioButtonCard value={StakeDuration.X12} label="12 months" description="Multiplier: 4x" />
            </RadioGroup>
          </div>

          <div className="mt-10">
            <TextInputBox
              label=""
              value={value?.toString()}
              type="text"
              onChange={(v) => !isNaN(+v) && +v <= balance && setValue(+v)}
              placeholder="Enter amount to stake"
              isFullWidth
              renderRightIcon={() => (
                <Button variant="gray" className="rounded-md py-1" onClick={() => setValue(balance)}>
                  Max
                </Button>
              )}
            />
          </div>
          <div className="text-right mr-2 mt-1 text-theme-gray-300">Balance: {balance}</div>

          <div className="text-lg mt-10 flex justify-between">
            <span>Voting power</span>
            <span>4,000</span>
          </div>
          <hr className="my-3" />
          <div className="text-lg font-medium flex justify-between">
            <span>Estimated APR</span>
            <span>20%</span>
          </div>
        </div>

        <Button className="w-full py-3 mt-12" onClick={onStake} disabled={isStaking}>
          Stake
        </Button>
      </div>
    </Modal>
  );
};

/**
 * Radio button componentn that's rendered on screen like a small card.
 * To be used within `RadioGroup`.
 */
const RadioButtonCard: React.FC<{ value: string | number; label: string; description?: string }> = ({
  value,
  label,
  description
}) => {
  return (
    <div className="rounded-md bg-white cursor-pointer">
      <RadioGroup.Option
        value={value}
        className={({ checked }) => `
            ${checked ? 'border-theme-gray-200 bg-theme-gray-100' : 'border-gray-200'}
            relative flex flex-row justify-between items-center border p-4
          `}
      >
        {({ checked }) => (
          <>
            <div className="flex flex-col">
              <RadioGroup.Label as="span" className={twMerge('block text-sm font-medium')}>
                {label}
              </RadioGroup.Label>

              {description && (
                <RadioGroup.Description as="span" className={twMerge('text-gray-500', 'block text-sm')}>
                  {description}
                </RadioGroup.Description>
              )}
            </div>
            <input type="radio" checked={checked} className="text-black" />
          </>
        )}
      </RadioGroup.Option>
    </div>
  );
};
