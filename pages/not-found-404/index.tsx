import React from 'react';
import { Button, PageBox } from 'src/components/common';
import image404 from 'src/images/404.png';
import { indexCollection } from 'src/utils/orderbookUtils';

interface Props {
  collectionSlug?: string;
  // for tokenId not found page:
  chainId?: string;
  collectionAddress?: string;
  tokenId?: string;
}

const NotFound404Page = ({ collectionAddress = '', chainId = '', collectionSlug = '' }: Props) => {
  return (
    <PageBox title="404 Not Found" showTitle={false}>
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <img src={image404.src} width={(image404.width * 2) / 3} height={(image404.height * 2) / 3} />

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
    </PageBox>
  );
};

export default NotFound404Page;
