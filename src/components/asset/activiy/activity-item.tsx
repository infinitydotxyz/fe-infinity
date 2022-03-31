import React from 'react';

interface ActivityItemPropType {}

interface ActivityColumnPropType {
  label: string;
  children: React.ReactNode;
}

const ActivityColumn: React.FC<ActivityColumnPropType> = ({ label, children }) => {
  return (
    <div className="font-heading tracking-tight">
      <p className="text-gray-600">{label}</p>
      <p className="font-bold  text-black">{children}</p>
    </div>
  );
};

export const ActivityItem: React.FC<ActivityItemPropType> = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3 bg-gray-50 px-6 sm:px-6 md:px-8 lg:px-16 -mx-1 my-2 sm:my-4 py-5 md:py-4 md:pt-12 md:pb-14 rounded-3xl">
      <div>
        <p className="font-heading tracking-tight text-gray-600">Seller</p>
        <p className="font-heading font-bold tracking-tight text-black">ON1 Force</p>
      </div>
      <div>
        <p className="font-heading tracking-tight text-gray-600">Buyer</p>
        <p className="font-heading font-bold tracking-tight text-black">Nhmen_Howzer</p>
      </div>
      <div>
        <p className="font-heading tracking-tight text-gray-600">Price</p>
        <p className="font-heading font-bold tracking-tight text-black">Ξ 2.5</p>
      </div>
      <div>
        <p className="font-heading tracking-tight text-gray-600">Date</p>
        <p className="font-heading font-bold tracking-tight text-black">15 mins ago</p>
      </div>
      <div>
        <p className="font-heading tracking-tight text-gray-600">Link</p>
        <p className="font-heading font-bold tracking-tight text-black">0x0270...f7B3</p>
      </div>
    </div>
  );
};
