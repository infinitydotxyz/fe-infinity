import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Button, PageBox, ShortAddress, ReadMoreText } from 'src/components/common';
import {
  TraitList,
  ActivityList,
  Filter,
  ToggleSwitchButton,
  ListModal,
  CancelModal,
  TransferNFTModal,
  PlaceBidModal,
  MakeOfferModal
} from '../../../../src/components/asset';

import blueCheckImage from 'src/images/blue-check.svg';
import transferImage from 'src/images/transfer.svg';

const AssetDetail: FunctionComponent<{}> = () => {
  return (
    <PageBox title="Asset Detail" hideTitle>
      <CancelModal />
      <TransferNFTModal />
      <ListModal />
      <CancelModal />
      <TransferNFTModal />
      <MakeOfferModal />
      <PlaceBidModal />

      <div className="mb-4">
        <div className="w-80 mx-auto sm:float-left sm:w-64 md:w-80  lg:w-96 xl:w-128 sm:mr-6 md:mr-8 lg:mr-16 mb-4">
          <img
            alt={`Image - ON1`}
            className="rounded-3xl w-full"
            src={
              'https://lh3.googleusercontent.com/YyzGD0VC3GvFafiWQwIQ_M4U8XauTI28S8VTImMLXkQ4DrJh-1AzGejZLQ5Q9uUluw7KMads8FdzfwtWBC8_jwvaOGxMkWZAY6KQNQ=s0'
            }
          />
        </div>
        <div className="mb-2 md:pb-4">
          <ToggleSwitchButton />
        </div>
        <h3 className="text-black theme-font-body text-2xl font-bold leading-9 tracking-wide pb-1">ON1</h3>
        <div className="flex items-center sm:mb-8">
          <Link href={`${window.origin}/collection/${name}`}>
            <a href={`${window.origin}/collection/${name}`} className="text-theme-light-800 tracking-tight mr-2">
              ON1
            </a>
          </Link>
          <img className="w-5 h-5" src={blueCheckImage.src} alt={'Verified'} />
        </div>
        <ShortAddress
          address="0xADADADADADADADADADADADADADA"
          href="#"
          label="Contact address:"
          tooltip="0xADADADADADADADADADADADADADA"
        />
        <ShortAddress address="#3460" href="#" label="Token ID:" tooltip="#3460" />
        <div className="flex flex-col md:flex-row gap-4 my-4 lg:my-8">
          <Button variant="primary" size="large" className="p-4 rounded-full">
            Buy&nbsp;3.30 ETH
          </Button>
          <Button variant="outline" size="large" className="p-4 rounded-full">
            Make offer
          </Button>
          {/* <div className="border w-12 h-12 flex justify-center items-center rounded-full">
      <img src={transferImage.src} alt="Transfer" />
    </div>*/}
        </div>
        <p className="theme-font-body text-black">Description</p>
        <div>
          <ReadMoreText
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed. "
            min={100}
            ideal={120}
            max={200}
            readMoreText="Read more"
          />
        </div>
      </div>

      <div className="float-left w-full">
        <TraitList />

        <div className="mt-4 md:mt-8">
          <div className="flex items-center justify-between">
            <p className="mt-4 sm:mt-6 sm:mb-4 theme-font-body tracking-base text-black">Activity</p>
            <Filter />
          </div>
        </div>

        <ActivityList />
      </div>
      {/* <NFTEvents address={tokenAddress} tokenId={tokenId} /> */}
    </PageBox>
  );
};

export default AssetDetail;
