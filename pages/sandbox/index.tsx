import { FC, ReactNode, useState } from 'react';
import { FaTwitter, FaFacebook, FaEdit } from 'react-icons/fa';
import { CancelModal } from 'src/components/asset';
import {
  Button,
  CurrencyInput,
  Dropdown,
  ShortAddress,
  SimpleTable,
  SimpleTableItem,
  Toggle,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { Layout } from 'src/components/common/layout';
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

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({ title: 'Balance', value: <div className="font-bold">23 Eth</div> });
  tableItems.push({ title: 'Budget', value: <div className="font-bold">3 Eth</div> });

  return (
    <Layout title="SandBox" className="grid place-items-center py-8">
      <div>
        <h1 className="text-start font-body font-bold text-3xl tracking-tight">Sandbox</h1>
      </div>
      <div className="w-3/5">
        <SBHeader># Text</SBHeader>
        <div>
          <div className="text-primary">text-primary</div>
          <div className="text-secondary">text-secondary</div>
        </div>

        <SBHeader># Button</SBHeader>
        <div className="flex space-x-4">
          <Button variant="primary">Primary</Button>
          <Button variant="primary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <FaEdit />
            <span>With Icon</span>
          </Button>
          <Button variant="plain" size="plain">
            Unstyled (plain)
          </Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <SBHeader># Chip</SBHeader>
        <div className="flex flex-row space-x-4">
          <Chip content="Watch" />
          <Chip left={<FaEdit />} content="Edit" active={true} />
          <Chip content={<FaTwitter />} />
          <Chip content={<FaFacebook />} />
        </div>

        <SBHeader># Dropdown</SBHeader>
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

        <SBHeader># RoundedNav</SBHeader>
        <RoundedNav items={[{ title: 'NFT' }, { title: 'Community' }]} className="w-80 mt-6" />

        <SBHeader># ToggleTab</SBHeader>
        <ToggleTab options={options} selected={selected} onChange={onChange} />

        <SBHeader># Card - WIP</SBHeader>
        <div className="flex flex-row space-x-4">
          <Card data={testData.cardTestData[0]} onClick={() => console.log('click')} isSellCard={false} />
          <Card data={testData.cardTestData[1]} onClick={() => console.log('click')} isSellCard={false} />
        </div>

        <SBHeader># CurrencyInput</SBHeader>
        <CurrencyInput
          value={currency}
          label="Enter offer"
          placeholder=""
          onChange={(value) => {
            setCurrency(parseFloat(value));
          }}
        />

        <SBHeader># ShortAddress</SBHeader>
        <ShortAddress
          label="Contact address:"
          address={'0x78979787978'}
          href={`/collection/xxx`}
          tooltip={'0x78979787978'}
        />

        <SBHeader># CancelModal</SBHeader>
        <CancelModal />

        <SBHeader># Toggle</SBHeader>
        <div className="w-1/2">
          <Toggle title="Dark mode" />
        </div>

        <SBHeader># ComboBox</SBHeader>
        <div className="w-1/2">
          <ComboBox options={comboValues} value={comboValue} onChange={(value) => setComboValue(value)} />
        </div>

        <SBHeader># SimpleTable</SBHeader>
        <div className="w-1/2">
          <SimpleTable items={tableItems} />
        </div>
      </div>
    </Layout>
  );
};

export default SandboxPage;

// ============================================================

interface Props {
  children: ReactNode;
}

export function SBHeader({ children }: Props) {
  return <div className="my-6 px-6 py-3 bg-slate-100 font-bold rounded-lg">{children}</div>;
}
