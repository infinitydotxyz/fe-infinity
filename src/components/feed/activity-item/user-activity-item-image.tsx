import { useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { BasicTokenInfo } from 'src/components/astra/types';
import { EZImage, NextLink } from 'src/components/common';

interface Props {
  src: string;
  relativeLink?: string;
  basicTokenInfo?: BasicTokenInfo;
  showModal?: boolean;
}

export const UserActivityItemImage = ({ src, relativeLink, showModal, basicTokenInfo }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (showModal) {
    return (
      <>
        {modalOpen && basicTokenInfo && (
          <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} setModalOpen={setModalOpen} />
        )}
        <EZImage
          src={src}
          className="w-14 h-14 rounded-lg overflow-clip cursor-pointer"
          onClick={() => {
            setModalOpen(true);
          }}
        />
      </>
    );
  } else {
    return (
      <NextLink href={relativeLink}>
        <EZImage src={src} className="w-14 h-14 rounded-lg overflow-clip" />
      </NextLink>
    );
  }
};
