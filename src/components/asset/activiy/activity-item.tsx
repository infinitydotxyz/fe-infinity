import React from 'react';

interface ActivityItemPropType {}

interface ActivityColumnPropType {
  label: string;
  children: React.ReactNode;
}

const ActivityColumn: React.FC<ActivityColumnPropType> = ({ label, children }) => {
  return (
    <div className="font-body tracking-tight">
      <p className="text-theme-light-800">{label}</p>
      <p className="font-bold  text-black">{children}</p>
    </div>
  );
};

export const ActivityItem: React.FC<ActivityItemPropType> = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3 bg-theme-light-300 px-6 sm:px-6 md:px-8 lg:px-16 -mx-1 my-2 sm:my-4 py-5 md:py-4 md:pt-12 md:pb-14 rounded-3xl">
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Seller</p>
        <p className="font-body font-bold tracking-tight text-black">ON1 Force</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Buyer</p>
        <p className="font-body font-bold tracking-tight text-black">Nhmen_Howzer</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Price</p>
        <p className="font-body font-bold tracking-tight text-black">Ξ 2.5</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Date</p>
        <p className="font-body font-bold tracking-tight text-black">15 mins ago</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Link</p>
        <p className="font-body font-bold tracking-tight text-black">0x0270...f7B3</p>
      </div>
    </div>
  );
};
