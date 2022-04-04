import { FC, useState } from 'react';
import { FaTwitter, FaFacebook, FaEdit } from 'react-icons/fa';
import { CancelModal } from 'src/components/asset';
import {
  Button,
  CurrencyInput,
  Dropdown,
  PageBox,
  ShortAddress,
  Toggle,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { Card } from 'src/components/common/card';
import { Chip } from 'src/components/common/chip';
import { ComboBox, ComboBoxBaseType } from 'src/components/common/combo-box';
import { RoundedNav } from 'src/components/common/rounded-nav';
import testData from './data.json';

const comboValues: ComboBoxBaseType[] = [
  { id: 0, name: 'Empty Trash' },
  { id: 1, name: 'Save File' },
  { id: 2, name: 'Download' }
];

const SandboxPage: FC = () => {
  const { options, onChange, selected } = useToggleTab(['Buy NFTs', 'Sell NFTs', 'Trade NFTs'], 'Buy NFTs');
  const [currency, setCurrency] = useState<number>(12.33);
  const [comboValue, setComboValue] = useState<ComboBoxBaseType>(comboValues[0]);

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
          <Button variant="ghost">Ghost</Button>
        </div>

        <h3># Chip</h3>
        <div className="flex flex-row space-x-4">
          <Chip content="Watch" />
          <Chip left={<FaEdit />} content="Edit" />
          <Chip content={<FaTwitter />} />
          <Chip content={<FaFacebook />} />
        </div>

        <h3># Dropdown</h3>
        <div className="flex flex-row space-x-4">
          <Dropdown
            label="Dropdown"
            items={[
              { label: 'Item 1', onClick: console.log },
              { label: 'Item 2', onClick: console.log }
            ]}
          />
          <Dropdown
            label="Custom Dropdown"
            toggler={<div className="border rounded-3xl py-2 px-4 bg-black text-white">Custom Toggler</div>}
            items={[
              { label: 'Item 3', onClick: console.log },
              { label: 'Item 4', onClick: console.log }
            ]}
          />
        </div>

        <h3># RoundedNav</h3>
        <RoundedNav items={[{ title: 'NFT' }, { title: 'Community' }]} className="w-80 mt-6" />

        <h3># ToggleTab</h3>
        <ToggleTab options={options} selected={selected} onChange={onChange} />

        <h3># Card - WIP</h3>
        <div className="flex flex-row space-x-4">
          <Card data={testData.cardTestData[0]} onClick={() => console.log('click')} isSellCard={false} />
          <Card data={testData.cardTestData[1]} onClick={() => console.log('click')} isSellCard={false} />
        </div>

        <h3># CurrencyInput</h3>
        <CurrencyInput
          value={currency}
          label="Enter offer"
          placeholder=""
          onChange={(value) => {
            setCurrency(parseFloat(value));
          }}
        />

        <h3># ShortAddress</h3>
        <ShortAddress
          label="Contact address:"
          address={'0x78979787978'}
          href={`/collection/xxx`}
          tooltip={'0x78979787978'}
        />

        <h3># CancelModal</h3>
        <CancelModal />

        <h3># Toggle</h3>
        <Toggle title="Toggle" />

        <ComboBox options={comboValues} value={comboValue} onChange={(value) => setComboValue(value)} />

        <h3># More</h3>
        <div>&nbsp;</div>
      </div>
    </PageBox>
  );
};

export default SandboxPage;
