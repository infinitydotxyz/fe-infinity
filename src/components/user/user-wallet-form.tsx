import { TextInputForm } from 'src/components/common';
import { BiPlus } from 'react-icons/bi';

export const UserWalletForm = () => {
  return (
    <div>
      <TextInputForm bind="displayName" type="text" label="Address or ENS Name" placeholder="Address or ENS Name" />
      <button
        type="button"
        className="flex items-center justify-center w-full text-center bg-theme-light-200 px-6 py-2 rounded-3xl hover:bg-theme-dark-500"
      >
        <div className="flex items-center">
          <span className="pr-4">Add Wallet</span> <BiPlus />
        </div>
      </button>
    </div>
  );
};
