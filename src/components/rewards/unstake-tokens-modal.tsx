import { formatEth } from '@infinityxyz/lib-frontend/utils';
import React, { useState } from 'react';
import { useCurationQuota } from 'src/hooks/api/useCurationQuota';
import {
  getLockRemainingDescription,
  mapDurationToMonths,
  useRemainingLockTime
} from 'src/hooks/contract/staker/useRemainingLockTime';
import { useUnstake } from 'src/hooks/contract/staker/useUnstake';
import { nFormatter } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { Heading, toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

interface Props {
  onClose: () => void;
}

export const UnstakeTokensModal = ({ onClose }: Props) => {
  // const [hoverRef, isHovered] = useHover<HTMLDivElement>();
  const { user } = useOnboardContext();
  const { result: curationQuota } = useCurationQuota(user?.address ?? null);
  const [value, setValue] = useState(0);
  const [isUnstaking, setIsUnstaking] = useState(false);
  // const [isRageQuitting, setIsRageQuitting] = useState(false);
  const { stakeAmounts, unlockedAmount } = useRemainingLockTime(curationQuota?.stake?.stakeInfo ?? null);
  const { unstake } = useUnstake();
  // const { userAmount: rageQuitYield, penalty: rageQuitPenalty, rageQuit } = useRageQuit();

  const onUnstake = async () => {
    if (value <= 0) {
      toastError('Please enter a valid unstake amount');
      return;
    }

    setIsUnstaking(true);

    try {
      await unstake(value);
      setIsUnstaking(false);
      onClose();
      toastSuccess('Unstake successful, change in tokens will reflect shortly.');
    } catch (err) {
      console.error(err);
      setIsUnstaking(false);
    }
  };

  // const onRageQuit = async () => {
  //   setIsRageQuitting(true);

  //   try {
  //     await rageQuit();
  //     toastSuccess('Unstake successful, change in tokens will reflect shortly.');
  //     setIsRageQuitting(false);
  //   } catch (err) {
  //     console.error(err);
  //     setIsRageQuitting(false);
  //   }
  // };

  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <Heading className="text-3xl -mt-8 font-medium font-body">Unstake tokens</Heading>
        <div className="mt-4">
          {stakeAmounts.length > 0 && (
            <div className="text-md flex flex-col justify-between">
              <table>
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left font-medium font-heading">Stake duration</th>
                    <th className="text-left font-medium font-heading">Amount</th>
                    <th className="text-left font-medium font-heading">Lock remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {stakeAmounts
                    .sort((a, b) => a.stakeDuration - b.stakeDuration)
                    .map((item) => {
                      return (
                        <tr className="font-heading text-m" key={item.stakeDuration}>
                          <td>{mapDurationToMonths[item.stakeDuration]} Months</td>
                          <td>{nFormatter(formatEth(item.amount))}</td>
                          <td>{getLockRemainingDescription(item)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-m mt-4 flex justify-between">
            <span>Total staked</span>
            <span className="font-heading">{nFormatter(curationQuota?.totalStaked || 0)}</span>
          </div>

          <div className="text-m mt-2 flex justify-between">
            <span>Total unlocked</span>
            <span className="font-heading">{nFormatter(unlockedAmount || 0)}</span>
          </div>

          <div className="mt-2">
            <TextInputBox
              label=""
              value={value?.toString()}
              type="text"
              onChange={(v) => !isNaN(+v) && +v <= (unlockedAmount ?? 0) && setValue(+v)}
              placeholder="Enter amount to unstake"
              isFullWidth
              renderRightIcon={() => (
                <Button
                  variant="gray"
                  className="rounded-full py-2 px-3"
                  size="small"
                  onClick={() => setValue(unlockedAmount ?? 0)}
                >
                  Max
                </Button>
              )}
            />
          </div>
        </div>

        <Button size="large" className="w-full py-3 mt-4" onClick={onUnstake} disabled={isUnstaking}>
          Unstake
        </Button>
        {/* Keep the below code as an example for implementing the rage quit ui */}
        {/* 
        <Divider className="my-10" />

        <TooltipWrapper
          show={isHovered}
          tooltip={{
            title: 'Rage Quit',
            content:
              'Rage quitting allows you to unstake locked tokens for a penalty proportional to how long the tokens were originally staked for.'
          }}
        >
          <div className="text-lg mt-8 flex justify-start">
            <p>Rage Quit</p>
            <span className="relative inset-1" ref={hoverRef}>
              <AiOutlineQuestionCircle fontSize="1.25rem" />
            </span>
          </div>
        </TooltipWrapper>

        <div className="text-m mt-2 flex justify-between">
          <span>Yield</span>
          <span className="font-heading">{nFormatter(formatEth(rageQuitYield))}</span>
        </div>

        <div className="text-m mt-2 flex justify-between">
          <span>Penalty</span>
          <span className="font-heading">{nFormatter(formatEth(rageQuitPenalty))}</span>
        </div>

        <Button
          size="large"
          variant="danger"
          disabled={isUnstaking || isRageQuitting}
          className="w-full py-3 mt-4"
          onClick={onRageQuit}
        >
          Rage quit
        </Button> */}
      </div>
    </Modal>
  );
};
