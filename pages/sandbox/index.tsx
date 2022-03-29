import type { FC } from 'react';
import { FaTwitter, FaFacebook, FaEdit } from 'react-icons/fa';
import { Button, PageBox } from 'src/components/common';
import { Card } from 'src/components/common/card';
import Chip from 'src/components/common/chip';
import RoundedNav from 'src/components/common/rounded-nav';

export const SandboxPage: FC = () => {
  return (
    <PageBox title="SandBox">
      <div className="space-y-4">
        <h3># Text</h3>
        <div>
          <div className="text-primary">text-primary</div>
          <div className="text-secondary">text-secondary</div>
        </div>

        <h3># Button</h3>
        <div className="flex space-x-4">
          <Button variant="primary">Primary</Button>
          <Button variant="primary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <FaEdit />
            <span>With Icon</span>
          </Button>
          <Button variant="plain" size="plain">
            Unstyled Button
          </Button>
        </div>

        <h3># Chip</h3>
        <div className="flex flex-row space-x-4">
          <Chip content="Watch" />
          <Chip left={<FaEdit />} content="Edit" />
          <Chip content={<FaTwitter />} />
          <Chip content={<FaFacebook />} />
        </div>

        <h3># RoundedNav</h3>
        <RoundedNav items={[{ title: 'NFT' }, { title: 'Community' }]} className="w-80 mt-6" />

        <h3># Card - WIP</h3>
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
    </PageBox>
  );
};

export default SandboxPage;
