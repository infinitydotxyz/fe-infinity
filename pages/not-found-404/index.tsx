import React from 'react';
import { Button, PageBox } from 'src/components/common';
import notfound404 from 'src/images/notfound404.png';

interface Props {
  collectionSlug?: string;
  // for tokenId not found page:
  chainId?: string;
  collectionAddress?: string;
  tokenId?: string;
}

const NotFound404Page = ({ collectionSlug = '', chainId = '', collectionAddress = '', tokenId = '' }: Props) => {
  console.log('params: ', chainId, collectionAddress, tokenId);

  return (
    <PageBox title="404 Not Found" showTitle={false}>
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <img src={notfound404.src} width={(notfound404.width * 2) / 3} height={(notfound404.height * 2) / 3} />

        {collectionSlug ? (
          <>
            <div>We haven't loaded this collection yet. Click the button to queue it up.</div>

            <Button className="font-heading mt-10">Start queue</Button>
          </>
        ) : (
          <div>Page not found.</div>
        )}
      </div>
    </PageBox>
  );
};

export default NotFound404Page;
