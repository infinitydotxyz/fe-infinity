import { Spacer } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

// ---------------------------------
// Example
//
// const items: SimpleTableItem[] = [];
// items.push({ title: 'Max budget',  value: <div>{order.maxBudget}</div> });
// items.push({ title: '# NFTs', value: <div>{order.numItems}</div> });
//
// return (<div className="w-full">
//     <SimpleTable items={items} />
//   </div>)
// );

export interface SimpleTableItem {
  title: string | JSX.Element;
  value: JSX.Element;
}

interface Props {
  items: SimpleTableItem[];
  className?: string;
  rowClassName?: string;
  valueClassName?: string;
}

export const SimpleTable = ({ items, className = '', rowClassName = '', valueClassName = '' }: Props) => {
  const table = items.map((item) => {
    return (
      <div key={Math.random()} className={twMerge(`flex w-full items-center ${rowClassName}`)}>
        <div>{item.title}</div>
        <Spacer />
        <div className={twMerge('font-bold', valueClassName)}>{item.value}</div>
      </div>
    );
  });

  return <div className={twMerge('', className)}>{table}</div>;
};
