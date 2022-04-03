import { Spacer } from 'src/components/common';

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
      <div key={item.title} className="flex w-full">
        <div>{item.title}</div>
        <Spacer />
        <div>{item.value}</div>
      </div>
    );
  });

  return <>{table}</>;
}
