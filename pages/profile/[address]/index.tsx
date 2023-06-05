import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { CenteredContent, ConnectButton } from 'src/components/common';
import { ProfileCollections } from 'src/components/profile/profile-collections';
import { ProfileNFTs } from 'src/components/profile/profile-nfts';
import { ProfileOrderList } from 'src/components/profile/profile-order-list';
import { ProfilePageHeader } from 'src/components/profile/profile-page-header';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { ProfileTabs } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useAccount } from 'wagmi';

export default function ProfileItemsPage() {
  const { setRef } = useScrollInfo();
  const { address } = useAccount();
  const expanded = true;
  const tabs = [ProfileTabs.Items.toString(), ProfileTabs.Orders.toString()];
  const { selectedProfileTab } = useAppContext();
  const router = useRouter();
  const { showCart } = useAppContext();

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
    const isOwner = trimLowerCase(addressFromPath) === trimLowerCase(address);

    if (!addressFromPath || addressFromPath === 'undefined') {
      typeof window !== 'undefined' ? router.replace('/profile', undefined, { shallow: true }) : null;
    } else {
      if (isOwner) {
        if (!tabs.includes(ProfileTabs.Send.toString())) {
          tabs.push(ProfileTabs.Send.toString());
        }
      }

      setContent(
        <div className="flex flex-col h-full w-full">
          <ProfilePageHeader expanded={expanded} tabs={tabs} />

          <div ref={setRef} className="flex overflow-y-auto scrollbar-hide px-6">
            {!showCart && (
              <div className="flex w-1/5 mt-2 mb-[90px]">
                <ProfileCollections userAddress={addressFromPath} key={addressFromPath} />
              </div>
            )}

            <div className={showCart ? 'w-full' : 'w-4/5'}>
              {selectedProfileTab === ProfileTabs.Items && (
                <ProfileNFTs userAddress={addressFromPath} key={addressFromPath} isOwner={isOwner} />
              )}
              {selectedProfileTab === ProfileTabs.Orders && (
                <ProfileOrderList userAddress={addressFromPath} key={addressFromPath} isOwner={isOwner} />
              )}
              {selectedProfileTab === ProfileTabs.Send && (
                <ProfileNFTs userAddress={addressFromPath} key={addressFromPath} isOwner={isOwner} />
              )}
            </div>
          </div>
        </div>
      );
    }
  }, [router.isReady, router.asPath, selectedProfileTab, address, showCart]);

  return content;
}
