import { RadioGroup } from '@headlessui/react';
import { StakeDuration } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { useStake } from 'src/hooks/contract/staker/useStake';
import { useTokenAllowance } from 'src/hooks/contract/token/useTokenAllowance';
import { useTokenApprove } from 'src/hooks/contract/token/useTokenApprove';
import { useTokenBalance } from 'src/hooks/contract/token/useTokenBalance';
import { twMerge } from 'tailwind-merge';
import { Heading, toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

interface Props {
  onClose: () => void;
}

const multipliers = {
  [StakeDuration.None]: 1,
  [StakeDuration.ThreeMonths]: 2,
  [StakeDuration.SixMonths]: 3,
  [StakeDuration.TwelveMonths]: 4
};

const getMultiplier = (duration: StakeDuration) => `Multiplier: ${multipliers[duration]}x`;

export const StakeTokensModal = ({ onClose }: Props) => {
  const [stakeDuration, setStakeDuration] = useState<StakeDuration>(StakeDuration.None);
  const [value, setValue] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const { balance } = useTokenBalance();
  const { stake } = useStake();
  const { approve } = useTokenApprove();
  const { allowance } = useTokenAllowance();

  const onStake = async () => {
    if (value === 0) {
      toastError('Please enter a stake amount');
      return;
    }

    setIsStaking(true);

    try {
      if (allowance < value) {
        await approve(value);
      }

      await stake(value, stakeDuration);

      setIsStaking(false);
      onClose();
      toastSuccess('Stake successfull, change in tokens will reflect shortly.');
    } catch (err) {
      console.error(err);
      setIsStaking(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <Heading className="text-3xl -mt-8 font-medium font-body">Stake tokens</Heading>

        <div className="mt-2">
          <div>
            <RadioGroup value={stakeDuration} onChange={setStakeDuration} className="space-y-2">
              <RadioGroup.Label>Lock for:</RadioGroup.Label>
              <RadioButtonCard
                value={StakeDuration.None}
                label="No commitment"
                description={getMultiplier(StakeDuration.None)}
              />
              <RadioButtonCard
                value={StakeDuration.ThreeMonths}
                label="3 months"
                description={getMultiplier(StakeDuration.ThreeMonths)}
              />
              <RadioButtonCard
                value={StakeDuration.SixMonths}
                label="6 months"
                description={getMultiplier(StakeDuration.SixMonths)}
              />
              <RadioButtonCard
                value={StakeDuration.TwelveMonths}
                label="12 months"
                description={getMultiplier(StakeDuration.TwelveMonths)}
              />
            </RadioGroup>
          </div>

          <div className="mt-8">
            <TextInputBox
              label=""
              value={value?.toString()}
              type="text"
              onChange={(v) => !isNaN(+v) && +v <= balance && setValue(+v)}
              placeholder="Enter amount to stake"
              isFullWidth
              renderRightIcon={() => (
                <Button variant="gray" className="rounded-full py-2 px-3" onClick={() => setValue(balance)}>
                  Max
                </Button>
              )}
            />
          </div>
          <div className="text-right mr-2 mt-1 text-theme-gray-300">Balance: {balance}</div>

          <div className="text-lg mt-8 flex justify-between">
            <span>Voting power</span>
            <span>{value * multipliers[stakeDuration]}</span>
          </div>
          <hr className="my-3" />
          <div className="text-lg font-medium flex justify-between">
            <span>Estimated APR</span>
            <span>20%</span>
          </div>
        </div>

        <Button size="large" className="w-full py-3 mt-8" onClick={onStake} disabled={isStaking}>
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
    <div className="bg-white cursor-pointer">
      <RadioGroup.Option
        value={value}
        className={({ checked }) => `
            ${checked ? 'border-theme-gray-200 bg-theme-gray-100' : 'border-gray-200'}
            relative flex flex-row justify-between items-center border rounded-md p-4
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
            <input type="radio" checked={checked} className="text-black" readOnly />
          </>
        )}
      </RadioGroup.Option>
    </div>
  );
};
