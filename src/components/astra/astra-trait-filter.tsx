import { Menu } from '@headlessui/react';
import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useFetch } from 'src/utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { Filter } from 'src/utils/context/FilterContext';
import { Spinner } from '../common';
import { TraitSelection } from '../filter/trait-selection';
import { useOrderbook } from '../orderbook/OrderbookContext';
import { ATextButton } from './astra-button';
import { ACustomMenuContents, ACustomMenuButton, ADropdownButton, ACustomMenuItems } from './astra-dropdown';

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
              <ATextButton tooltip="Click to filter by trait">
                <ADropdownButton>Trait</ADropdownButton>
              </ATextButton>
            </ACustomMenuButton>
          </span>

          {open && (
            <ACustomMenuItems open={open} innerClassName="w-80">
              {!collectionAttributes && <Spinner />}
              {collectionAttributes && (
                <div className="h-[400px] overflow-y-scroll">
                  <TraitSelection
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
          )}
        </ACustomMenuContents>
      )}
    </Menu>
  );
};
