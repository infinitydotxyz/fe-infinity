import { MaxUint256 } from '@ethersproject/constants';
import { RadioGroup } from '@headlessui/react';
import { StakeDuration } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useStake } from 'src/hooks/contract/staker/useStake';
import { useTokenAllowance } from 'src/hooks/contract/token/useTokenAllowance';
import { useTokenApprove } from 'src/hooks/contract/token/useTokenApprove';
import { nFormatter } from 'src/utils';
import { BouncingLogo, toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';
import { RadioButtonCard } from '../common/radio-button-card';

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
  const [value, setValue] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const { result: quota } = useUserCurationQuota();
  const { stake } = useStake();
  const { approve } = useTokenApprove();
  const { allowance } = useTokenAllowance();

  const tokenBalance = quota?.tokenBalance || 0;

  const valueAsNumber = () => {
    return parseFloat(value);
  };

  const onStake = async () => {
    if (valueAsNumber() <= 0) {
      toastError('Please enter a stake amount');
      return;
    }

    setIsStaking(true);

    try {
      if (allowance < valueAsNumber()) {
        await approve(MaxUint256);
      }

      await stake(valueAsNumber(), stakeDuration);

      onClose();
      toastSuccess('Stake successful, change in tokens will reflect shortly.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      showActionButtons={false}
      title="Stake tokens"
      showCloseIcon={true}
      wide={false}
    >
      <div>
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
              value={value}
              type="number"
              onChange={(v) => {
                if (v) {
                  const floatVal = +parseFloat(v);

                  if (!isNaN(floatVal) && floatVal <= tokenBalance) {
                    setValue(v);
                  }
                } else {
                  setValue('');
                }
              }}
              placeholder="Enter amount to stake"
              isFullWidth
              renderRightIcon={() => (
                <Button
                  variant="gray"
                  size="small"
                  className="rounded-lg py-2 px-3"
                  onClick={() => setValue(tokenBalance.toString())}
                >
                  Max
                </Button>
              )}
            />
          </div>
          <div className="text-right mr-2 mt-1">Balance: {nFormatter(tokenBalance)}</div>

          <div className="text-lg mt-8 flex justify-between">
            <span>Voting power</span>
            <span>{valueAsNumber() * multipliers[stakeDuration]}</span>
          </div>
          {/* <hr className="my-3" />
          <div className="text-lg font-medium flex justify-between">
            <span>Estimated APR</span>
            <span>20%</span>
          </div> */}
        </div>

        <Button size="large" className="w-full py-3 mt-8" onClick={onStake} disabled={isStaking}>
          Stake
        </Button>

        {isStaking && (
          <div className="mt-2 flex flex-row gap-2 items-center">
            <BouncingLogo />
            <span>Waiting for transaction to complete...</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
