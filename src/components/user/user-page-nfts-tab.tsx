import { useOrderContext } from 'src/utils/context/OrderContext';
import { GalleryBox } from '../gallery/gallery-box';
import { UserProfileDto } from './user-profile-dto';

type Props = {
  userInfo: UserProfileDto;
};

export const UserPageNftsTab = ({ userInfo }: Props) => {
  const { addCartItem } = useOrderContext();

  return (
    <div>
      <div className="mt-20">
        <GalleryBox
          pageId="PROFILE"
          getEndpoint={`/user/${userInfo?.address}/nfts`}
          filterShowedDefault={false}
          showFilterSections={['COLLECTIONS']}
          cardProps={{
            cardActions: [
              {
                label: 'List',
                onClick: (ev, data) => {
                  addCartItem({
                    collectionName: data?.collectionName ?? '(no name)',
                    collectionAddress: data?.tokenAddress ?? '(no address)',
                    tokenImage: data?.image ?? '',
                    tokenName: data?.name ?? '(no name)',
                    tokenId: data?.tokenId ?? '0',
                    isSellOrder: true
                  });
                  // router.push(`/asset/${data?.chainId}/${data?.tokenAddress}/${data?.tokenId}`);
                }
              }
            ]
          }}
          className="mt-[-82px]"
        />
      </div>
    </div>
  );
};
