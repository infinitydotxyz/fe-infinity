import React, { useState } from 'react';
import { Button } from '../common';

export const Filter: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setShowFilter((show) => !show)}>
        Filter
      </Button>
      <div
        style={{ right: -4 }}
        className={`absolute top-14 bg-white right-0 shadow px-10 py-12 w-52 ${
          showFilter ? 'flex' : 'hidden'
        } flex-col space-between rounded-3xl`}
      >
        <Option text="Sales" />
        <div className="mt-8">
          <Option text="Transfers" />
        </div>
        <div className="mt-8">
          <Option text="Offers" />
        </div>
      </div>
    </div>
  );
};

type OptionProps = {
  text: string;
  onChange?: (value: boolean) => void;
};

const Option = ({ text, onChange }: OptionProps) => {
  return (
    <div className="flex justify-between">
      <span className="font-theme-heading text-theme-light-800">{text}</span>
      <input type="checkbox" className="border-gray-300 text-black focus:outline-none rounded h-5 w-5" />
    </div>
  );
};
