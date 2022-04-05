import { Spacer } from 'src/components/common';

// ---------------------------------
// Example
//
// const items: SimpleTableItem[] = [];
// items.push({ title: 'Max budget',  value: <div>{order.maxBudget}</div> });
// items.push({ title: 'Number of NFTs', value: <div>{order.numItems}</div> });
//
// return (<div className="w-full">
//     <SimpleTable items={items} />
//   </div>)
// );

export interface SimpleTableItem {
  title: string;
  value: JSX.Element;
}

interface Props {
  items: SimpleTableItem[];
}

export function SimpleTable({ items }: Props) {
  const table = items.map((item) => {
    return (
      <div key={item.title} className="flex w-full mb-2">
        <div>{item.title}</div>
        <Spacer />
        <div className="font-bold">{item.value}</div>
      </div>
    );
  });

  return <>{table}</>;
}
