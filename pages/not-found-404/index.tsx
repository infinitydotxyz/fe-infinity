import { APageBox } from 'src/components/astra/astra-page-box';
import { Button } from 'src/components/common';
import { indexCollection } from 'src/utils/orderbook-utils';

interface Props {
  collectionSlug?: string;
  // for tokenId not found page:
  chainId?: string;
  collectionAddress?: string;
  tokenId?: string;
}

const NotFound404Page = ({ collectionAddress = '', chainId = '', collectionSlug = '' }: Props) => {
  return (
    <APageBox title="404 Not Found" showTitle={false}>
      <div className="h-[70vh] flex flex-col items-center justify-center">
        {collectionAddress || collectionSlug ? (
          <>
            <div className="mt-4 text-xl">We haven't indexed this collection yet. Click index to queue it up.</div>

            <Button
              className="font-heading mt-10"
              onClick={() => indexCollection(false, chainId, collectionAddress, collectionSlug)}
            >
              Index collection
            </Button>
          </>
        ) : (
          <div className="mt-4 text-3xl">This page could not be found</div>
        )}
      </div>
    </APageBox>
  );
};

export default NotFound404Page;
