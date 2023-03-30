import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { CenteredContent, ConnectButton } from 'src/components/common';
import { ProfileNFTs } from 'src/components/profile/profile-nfts';
import { ProfileOrderList } from 'src/components/profile/profile-order-list';
import { ProfilePageHeader } from 'src/components/profile/profile-page-header';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { useAppContext } from 'src/utils/context/AppContext';
import { useAccount } from 'wagmi';

export enum ProfileTabs {
  Items = 'Items',
  Orders = 'Orders',
  Send = 'Send'
}

export default function ProfileItemsPage() {
  const { setRef } = useScrollInfo();
  const { address } = useAccount();
  const expanded = true;
  const tabs = [ProfileTabs.Items.toString(), ProfileTabs.Orders.toString()];
  const { selectedProfileTab } = useAppContext();
  const router = useRouter();

  const [content, setContent] = useState<ReactNode>(
    <CenteredContent>
      <ConnectButton />
    </CenteredContent>
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const addressFromPath = router.query.address as string;

    if (!addressFromPath || addressFromPath === 'undefined') {
      typeof window !== 'undefined' ? router.replace('/profile', undefined, { shallow: true }) : null;
    } else {
      if (trimLowerCase(addressFromPath) === trimLowerCase(address)) {
        tabs.push(ProfileTabs.Send.toString());
      }
      setContent(
        <div className="flex flex-col h-full w-full">
          <ProfilePageHeader expanded={expanded} tabs={tabs} />
          <div ref={setRef} className="overflow-y-auto scrollbar-hide">
            {selectedProfileTab === ProfileTabs.Items && (
              <ProfileNFTs userAddress={addressFromPath} key={addressFromPath} />
            )}
            {selectedProfileTab === ProfileTabs.Orders && (
              <ProfileOrderList userAddress={addressFromPath} key={addressFromPath} />
            )}
            {selectedProfileTab === ProfileTabs.Send && (
              <ProfileNFTs userAddress={addressFromPath} key={addressFromPath} />
            )}
          </div>
        </div>
      );
    }
  }, [router.isReady, router.asPath, selectedProfileTab]);

  return content;
}
