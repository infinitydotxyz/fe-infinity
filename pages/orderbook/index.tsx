import { ToggleTab, useToggleTab } from 'src/components/common';
import { OrderbookContent } from 'src/components/orderbook/orderbook-list';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';
import { useRouter } from 'next/router';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';
import { isProd } from 'src/utils';
import { APageBox } from 'src/components/astra/astra-page-box';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const OrderbookPage = () => {
  const router = useRouter();

  const tabs = isProd() ? ['List view', 'Graph view'] : ['List view', 'Graph view'];

  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'List view');

  return (
    <APageBox title="Orderbook">
      <ToggleTab className="" options={options} selected={selected} onChange={onChange} />

      <div className={twMerge(textClr, 'overflow-y-clip overflow-x-clip h-full')}>
        {selected === 'Graph view' && (
          <OrderbookProvider limit={50}>
            <OrderbookGraph className="mt-10" />
          </OrderbookProvider>
        )}
        {selected === 'List view' && (
          <OrderbookProvider limit={50}>
            <OrderbookContent className="" />
          </OrderbookProvider>
        )}
      </div>
    </APageBox>
  );
};

export default OrderbookPage;
