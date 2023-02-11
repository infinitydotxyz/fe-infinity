import { Menu } from '@headlessui/react';
import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import CollectionTraits from '../collection/collection-traits';
import { BouncingLogo } from '../common';
import { TokensFilter } from 'src/utils/types';
import { AOutlineButton } from './astra-button';
import { ACustomMenuButton, ACustomMenuContents, ACustomMenuItems, ADropdownButton } from './astra-dropdown';

interface Props {
  collectionAddress: string;
  filter: TokensFilter;
  setFilter: (filter: TokensFilter) => void;
  collectionAttributes?: CollectionAttributes;
}

export const ATraitFilter = ({ collectionAddress, filter, setFilter, collectionAttributes }: Props) => {
  return (
    <Menu>
      {({ open }) => (
        <ACustomMenuContents>
          <span>
            <ACustomMenuButton>
              <AOutlineButton tooltip="Filter by traits">
                <ADropdownButton isMenuOpen={open}>Traits</ADropdownButton>
              </AOutlineButton>
            </ACustomMenuButton>
          </span>

          <ACustomMenuItems open={open} innerClassName="w-[580px] border-0 px-0 py-0" alignMenuRight={true}>
            {!collectionAttributes && <BouncingLogo />}
            {collectionAttributes && (
              <div className="h-[400px]">
                <CollectionTraits
                  traits={collectionAttributes}
                  collectionAddress={collectionAddress}
                  filter={filter}
                  setFilter={setFilter}
                />
              </div>
            )}
          </ACustomMenuItems>
        </ACustomMenuContents>
      )}
    </Menu>
  );
};
