// import { useRouter } from 'next/router';
import { GalleryBox } from '../gallery/gallery-box';
// import { useAppContext } from 'src/utils/context/AppContext';
import { UserProfileDto } from './user-profile-dto';

type Props = {
  userInfo: UserProfileDto;
};

export const UserPageNftsTab = ({ userInfo }: Props) => {
  // const router = useRouter();
  // const { user } = useAppContext();

  return (
    <div>
      <div className="mt-20">
        <GalleryBox
          getEndpoint={`/user/${userInfo?.address}/nfts?chainId=1&limit=50`}
          filterShowedDefault={false}
          cardProps={{
            cardActions: [
              // {
              //   label: 'Details',
              //   onClick: (ev, data) => {
              //     router.push(`/asset/${data?.chainId}/${data?.tokenAddress}/${data?.tokenId}`);
              //   }
              // }
            ]
          }}
          className="mt-[-82px]"
        />
      </div>
    </div>
  );
};
