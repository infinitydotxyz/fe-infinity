import { Menu } from '@headlessui/react';
import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useFetch } from 'src/utils';
import CollectionTraits from '../collection/collection-traits';
import { Spinner } from '../common';
import { OrdersFilter, useOrdersContext } from '../../utils/context/OrdersContext';
import { AOutlineButton } from './astra-button';
import { ACustomMenuButton, ACustomMenuContents, ACustomMenuItems, ADropdownButton } from './astra-dropdown';

interface Props {
  collectionAddress: string;
}

export const ATraitFilter = ({ collectionAddress }: Props) => {
  const { setFilter } = useOrdersContext();
  const {
    query: { name }
  } = useRouter();

  const { result: collectionAttributes } = useFetch<CollectionAttributes>(
    name ? `/collections/${name}/attributes` : '',
    {
      chainId: '1'
    }
  );

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
            {!collectionAttributes && <Spinner />}
            {collectionAttributes && (
              <div className="h-[400px]">
                <CollectionTraits
                  traits={collectionAttributes}
                  collectionAddress={collectionAddress}
                  onChange={(traitTypes, traitValues) => {
                    const newFilter: OrdersFilter = {};
                    newFilter.traitTypes = traitTypes;
                    newFilter.traitValues = traitValues;
                    newFilter.orderBy = 'tokenIdNumeric';
                    setFilter((state) => ({ ...state, ...newFilter }));
                  }}
                  onClearAll={() => {
                    const newFilter: OrdersFilter = {};
                    newFilter.traitTypes = [];
                    newFilter.traitValues = [];
                    newFilter.orderBy = 'tokenIdNumeric';
                    setFilter((state) => ({ ...state, ...newFilter }));
                  }}
                />
              </div>
            )}
          </ACustomMenuItems>
        </ACustomMenuContents>
      )}
    </Menu>
  );
};
