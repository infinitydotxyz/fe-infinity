import type { FC } from 'react';
import { Card } from 'src/components/common/card';

export const SandboxPage: FC = () => {
  return (
    <div className="m-4 flex-col space-y-8">
      <h1>Sandbox</h1>

      <h3># Text</h3>
      <div>
        <h1 className="page-header">Page Header</h1>
        <div className="text-primary">Primary Text</div>
        <div className="text-secondary">Secondary Text</div>
      </div>

      <h3># Button</h3>
      <div className="flex flex-row space-x-4">
        <button>Button</button>
      </div>

      <h3># Card</h3>
      <div className="flex flex-row space-x-4">
        <Card
          data={{
            id: 'nft1',
            title: 'NFT 1',
            price: 1.5,
            image:
              'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
          }}
        />
        <Card
          data={{
            id: 'nft2',
            title: 'NFT 2',
            price: 2.5,
            image:
              'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
          }}
        />
      </div>
    </div>
  );
};

export default SandboxPage;
