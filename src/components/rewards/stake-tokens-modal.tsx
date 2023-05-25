import { MaxUint256 } from '@ethersproject/constants';
import { useState } from 'react';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { useTokenAllowance } from 'src/hooks/contract/token/useTokenAllowance';
import { useTokenApprove } from 'src/hooks/contract/token/useTokenApprove';
import { FLOW_TOKEN, nFormatter } from 'src/utils';
import { useAccount, useBalance } from 'wagmi';
import { BouncingLogo, toastError, toastSuccess } from '../common';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

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
      toastError('Please enter a stake amount');
      return;
    }

    setIsStaking(true);

    try {
      if (allowance < valueAsNumber()) {
        await approve(MaxUint256);
      }

      await stake(valueAsNumber());

      onClose();
      toastSuccess('Stake successful.');
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
          <div className="text-sm text-gray-400">Reward boost levels</div>
          <div className="mt-4 flex flex-row gap-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">1.5x</div>
              <div className="text-xs text-gray-400">10k ${FLOW_TOKEN.symbol}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">2x</div>
              <div className="text-xs text-gray-400">50k ${FLOW_TOKEN.symbol}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">2.5x</div>
              <div className="text-xs text-gray-400">100k ${FLOW_TOKEN.symbol}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">3x</div>
              <div className="text-xs text-gray-400">200k ${FLOW_TOKEN.symbol}</div>
            </div>
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
