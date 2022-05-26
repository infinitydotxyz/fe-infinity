import React from 'react';
import { PageBox } from 'src/components/common';

const RewardsPage = () => {
  return (
    <PageBox title="Rewards" showTitle={false}>
      <div className="flex">
        <div className="w-2/3">Token Balance</div>
        <div className="w-1/3">NFT Tokens</div>
      </div>
    </PageBox>
  );
};

export default RewardsPage;
