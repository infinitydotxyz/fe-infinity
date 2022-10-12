import { PageBox, ToggleTab, useToggleTab } from 'src/components/common';
import { OrderbookContent } from 'src/components/orderbook/orderbook-list';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';
import { useRouter } from 'next/router';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';

const OrderbookPage = () => {
  return (
    <PageBox title="Orderbook">
      <OrderbookProvider limit={50}>
        <_OrderbookPage />
      </OrderbookProvider>
    </PageBox>
  );
};

export default OrderbookPage;

// =====================================================

const _OrderbookPage = () => {
  const router = useRouter();

  const { options, onChange, selected } = useToggleTab(
    ['List view', 'Graph view'],
    (router?.query?.tab as string) || 'List view'
  );

  return (
    <>
      <>
        <ToggleTab className="" options={options} selected={selected} onChange={onChange} />
        {selected === 'Graph view' && <OrderbookGraph className="mt-10" />}
        {selected === 'List view' && <OrderbookContent className="" />}
      </>
    </>
  );
};
