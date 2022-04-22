import { FunctionComponent, useState } from 'react';
import { RoundedNav } from 'src/components/common';

export const UserProfileTab: FunctionComponent = () => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <RoundedNav
        items={[{ title: 'Collected' }, { title: 'Activity' }]}
        onChange={(currentTab) => setCurrentTab(currentTab)}
        className="mt-14 -ml-2"
      />
      <div className="mt-6 min-h-[1024px]">
        {currentTab === 1 && <div>Curated</div>}
        {currentTab === 2 && <div>Bext1</div>}
      </div>
    </>
  );
};
