import React, { useState } from 'react';
import { Button } from '../common/button';
import { TextInputBox } from '../common/input-box';
import { Modal } from '../common/modal';

interface Props {
  onClose: () => void;
}

export const StakeTokensModal = ({ onClose }: Props) => {
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true}>
      <div>
        <div className="text-3xl font-medium">Stake tokens</div>

        <div className="mt-12">
          <div>
            <input
              id="default-range"
              type="range"
              value={sliderValue}
              onChange={(ev) => setSliderValue(parseInt(ev.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between mt-1">
              <div>Lock for: 0 months</div>
              <div className="flex">
                <div>Weight: </div>
                <div className="w-8 text-right ml-1">{sliderValue / 100}</div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <TextInputBox
              label=""
              value={''}
              type="text"
              onChange={() => console.log}
              placeholder="Enter amount to stake"
              isFullWidth
            />
          </div>
          <div className="text-right mr-2 mt-1 text-theme-gray-300">Balance: 0</div>

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

        <Button className="w-full py-3 mt-12">Stake</Button>
      </div>
    </Modal>
  );
};
