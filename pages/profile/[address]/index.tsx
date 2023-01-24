import { useRouter } from 'next/router';
import { ProfileNFTs } from 'src/components/profile/profile-nfts';
import { ProfileOrderList } from 'src/components/profile/profile-order-list';
import { ProfilePageHeader } from 'src/components/profile/profile-page-header';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { useAppContext } from 'src/utils/context/AppContext';

export enum ProfileTabs {
  Items = 'Items',
  Orders = 'Orders',
  Send = 'Send'
}

export default function ProfileItemsPage() {
  const { setRef, scrollTop } = useScrollInfo();
  const expanded = scrollTop < 100;
  const tabs = [ProfileTabs.Items.toString(), ProfileTabs.Orders.toString(), ProfileTabs.Send.toString()];
  const { selectedProfileTab } = useAppContext();

  const router = useRouter();
  const addressFromPath = router.query.address as string;
  if (!addressFromPath) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ProfilePageHeader expanded={expanded} tabs={tabs} />
      <div ref={setRef} className="overflow-y-auto">
        {selectedProfileTab === 'Items' && <ProfileNFTs userAddress={addressFromPath} />}
        {selectedProfileTab === 'Orders' && <ProfileOrderList userAddress={addressFromPath} />}
        {selectedProfileTab === 'Send' && <ProfileNFTs userAddress={addressFromPath} />}
      </div>
    </div>
  );
}
