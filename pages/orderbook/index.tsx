import { PageBox, ToggleTab, useToggleTab } from 'src/components/common';
import { OrderbookContent } from 'src/components/orderbook/orderbook-list';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';
import { useRouter } from 'next/router';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';
import { isProd } from 'src/utils';

const OrderbookPage = () => {
  const router = useRouter();

  const tabs = isProd() ? ['List view', 'Graph view'] : ['List view', 'Graph view', 'Reservoir'];

  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'List view');

  return (
    <PageBox title="Orderbook">
      <ToggleTab className="" options={options} selected={selected} onChange={onChange} />
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
      {selected === 'Reservoir' && (
        <OrderbookProvider limit={50} reservoir={true}>
          <OrderbookContent className="" />
        </OrderbookProvider>
      )}
    </PageBox>
  );
};

export default OrderbookPage;
