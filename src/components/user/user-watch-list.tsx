import { FunctionComponent } from 'react';
import { ellipsisAddress } from 'src/utils';
import { FaLink } from 'react-icons/fa';
import { ADropdown } from '../astra/astra-dropdown';

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

  return <ADropdown label={`${userWatchList.length} Wallets`} items={renderItems()} />;
};
