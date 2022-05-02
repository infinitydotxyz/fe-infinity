import { CollectionGrid, PageBox } from 'src/components/common';
import { OrderDrawer } from 'src/components/market/order-drawer/order-drawer';
import { useOrderContext } from 'src/utils/context/OrderContext';

export const PixelScore = () => {
  const { orderDrawerOpen, setOrderDrawerOpen, addCartItem } = useOrderContext();

  return (
    <PageBox title="Pixel Score">
      <CollectionGrid
        query=""
        buttonName="View Score"
        onButtonClick={(collection) => {
          addCartItem({
            collectionName: collection.name ?? '(no name)',
            collectionAddress: collection.address ?? '(no address)',
            collectionImage: collection.profileImage ?? '',
            isSellOrder: false
          });
        }}
      />

      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />
    </PageBox>
  );
};

export default PixelScore;
