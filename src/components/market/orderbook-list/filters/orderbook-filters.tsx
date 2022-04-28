import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

type OpenFilterState = {
  [filter: string]: boolean;
};

export const OrderbookFilters = () => {
  const [openState, setOpenState] = useState<OpenFilterState>({});
  const filters = ['Order type', 'Collection', 'Price Range', 'Number of NFTs'];

  return (
    <div className="flex flex-col mr-12">
      <div className="text-2xl font-bold">Filter</div>
      {filters.map((filter) => (
        <OrderbookFilterItem key={filter} openState={openState} setOpenState={setOpenState} item={filter} />
      ))}
    </div>
  );
};

type OrderbookFilterItemProps = {
  openState: OpenFilterState;
  setOpenState: React.Dispatch<React.SetStateAction<OpenFilterState>>;
  item: string;
};

const OrderbookFilterItem = ({ openState, setOpenState, item }: OrderbookFilterItemProps) => {
  return (
    <React.Fragment>
      <div
        className="my-6 flex items-center cursor-pointer font-heading font-thin"
        onClick={() => {
          const newOpenState = { ...openState, [item]: !openState[item] };
          setOpenState(newOpenState);
        }}
      >
        <div className="flex-1">{item}</div>
        {openState[item] ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
      </div>

      {openState[item] && (
        <>
          <div className="mb-6 pb-8 border-b border-gray-300">filter content here</div>
        </>
      )}
    </React.Fragment>
  );
};
