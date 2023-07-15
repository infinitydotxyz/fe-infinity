import { MaxUint256 } from '@ethersproject/constants';
import { useEffect, useState } from 'react';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { useTokenAllowance } from 'src/hooks/contract/token/useTokenAllowance';
import { useTokenApprove } from 'src/hooks/contract/token/useTokenApprove';
import { FLOW_TOKEN, SEASON_2_UNLOCK_BLOCK, nFormatter } from 'src/utils';
import { fetchMinXflStakeForZeroFees } from 'src/utils/orderbook-utils';
import { useAccount, useBalance } from 'wagmi';
import { BouncingLogo, toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';
import { twMerge } from 'tailwind-merge';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { useTheme } from 'next-themes';

interface Props {
  onClose: () => void;
}

export const StakeTokensModal = ({ onClose }: Props) => {
  const [value, setValue] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const { stake } = useStakerContract();
  const { approve } = useTokenApprove();
  const { allowance } = useTokenAllowance();
  const { address } = useAccount();
  const [minStakeAmountForBoost, setMinStakeAmountForBoost] = useState(0);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    const fetchMinStakeAmountForBoost = async () => {
      const minStakeAmount =
        minStakeAmountForBoost === 0 ? await fetchMinXflStakeForZeroFees() : minStakeAmountForBoost;
      setMinStakeAmountForBoost(minStakeAmount);
    };
    fetchMinStakeAmountForBoost();
  });

  const xflBalanceObj = useBalance({
    address,
    token: FLOW_TOKEN.address as `0x${string}`,
    watch: false,
    cacheTime: 5_000
  });
  const tokenBalance = parseFloat(xflBalanceObj?.data?.formatted ?? '0');

  const valueAsNumber = () => {
    return parseFloat(value);
  };

  const onStake = async () => {
    if (valueAsNumber() <= 0) {
      toastError('Please enter a stake amount', darkMode);
      return;
    }

    setIsStaking(true);

    try {
      if (allowance < valueAsNumber()) {
        await approve(MaxUint256);
      }

      await stake(valueAsNumber());

      onClose();
      toastSuccess('Stake successful.', darkMode);
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
          <div className="text-sm space-y-1">
            {/* <div>
              Reward boost when {nFormatter(minStakeAmountForBoost)} ${FLOW_TOKEN.symbol} staked:{' '}
              <span className="font-extrabold ml-1">2x</span>
            </div> */}
            <div>
              Royalties are waived when {nFormatter(minStakeAmountForBoost)} ${FLOW_TOKEN.symbol} tokens are staked.
            </div>
            {/* <div>
              Platform fees and royalties when {nFormatter(minStakeAmountForBoost)} ${FLOW_TOKEN.symbol} staked:{' '}
              <span className="font-extrabold ml-1">0</span>
            </div> */}
            <div className={twMerge('text-xs', secondaryTextColor)}>
              Staked tokens are locked until the end of each reward season to prevent abuse. Current season ends at
              block {SEASON_2_UNLOCK_BLOCK}, approximately on Nov 3 2023.
            </div>
          </div>

          <div className="mt-6">
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
                <Button size="small" className="rounded-lg py-2 px-3" onClick={() => setValue(tokenBalance.toString())}>
                  Max
                </Button>
              )}
            />
          </div>
          <div className="text-right mr-2 mt-1">Balance: {nFormatter(tokenBalance)}</div>
        </div>

        <Button size="large" className="w-full py-3 mt-8" onClick={onStake} disabled={isStaking}>
          Stake
        </Button>

        {isStaking && (
          <div className="mt-2 flex items-center">
            <BouncingLogo />
          </div>
        )}
      </div>
    </Modal>
  );
};
