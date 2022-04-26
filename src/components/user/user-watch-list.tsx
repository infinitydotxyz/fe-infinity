import { FunctionComponent } from 'react';
import { Dropdown } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { FaLink } from 'react-icons/fa';

interface UserWatchListProps {
  userWatchList: string[];
}

export const UserWatchList: FunctionComponent<UserWatchListProps> = ({ userWatchList }) => {
  const renderItems = () => {
    return userWatchList.map((address) => {
      return {
        label: (
          <span className="flex items-center">
            <FaLink />
            <span className="pl-4">{ellipsisAddress(address)}</span>
          </span>
        ),
        onClick: () => {
          console.log(address);
        }
      };
    });
  };

  return (
    <Dropdown
      toggler={
        <span className="flex items-center px-2 py-1 rounded-full text-xs bg-theme-light-300">
          {userWatchList.length} Wallets
        </span>
      }
      items={renderItems()}
    />
  );
};
