import { Menu } from '@headlessui/react';
import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useFetch } from 'src/utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { Filter } from 'src/utils/context/FilterContext';
import CollectionTraits from '../collection/traits';
import { Spinner } from '../common';
import { useOrderbook } from '../orderbook/OrderbookContext';
import { AOutlineButton } from './astra-button';
import { ACustomMenuButton, ACustomMenuContents, ACustomMenuItems, ADropdownButton } from './astra-dropdown';

export const ATraitFilter: React.FC = () => {
  const { setFilters } = useOrderbook();
  const { collection } = useDashboardContext();
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
                {/* <TraitSelection
                  traits={collectionAttributes}
                  collectionAddress={collection?.address}
                  onChange={(traitTypes, traitValues) => {
                    const newFilter: Filter = {};
                    newFilter.traitTypes = traitTypes;
                    newFilter.traitValues = traitValues;
                    newFilter.orderBy = 'tokenIdNumeric';
                    setFilters((state) => ({ ...state, ...newFilter }));
                  }}
                  onClearAll={() => {
                    const newFilter: Filter = {};
                    newFilter.traitTypes = [];
                    newFilter.traitValues = [];
                    newFilter.orderBy = 'tokenIdNumeric';
                    setFilters((state) => ({ ...state, ...newFilter }));
                  }}
                /> */}
                <CollectionTraits
                  traits={collectionAttributes}
                  collectionAddress={collection?.address}
                  onChange={(traitTypes, traitValues) => {
                    const newFilter: Filter = {};
                    newFilter.traitTypes = traitTypes;
                    newFilter.traitValues = traitValues;
                    newFilter.orderBy = 'tokenIdNumeric';
                    setFilters((state) => ({ ...state, ...newFilter }));
                  }}
                  onClearAll={() => {
                    const newFilter: Filter = {};
                    newFilter.traitTypes = [];
                    newFilter.traitValues = [];
                    newFilter.orderBy = 'tokenIdNumeric';
                    setFilters((state) => ({ ...state, ...newFilter }));
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
