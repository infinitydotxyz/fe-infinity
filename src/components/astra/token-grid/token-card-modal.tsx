import { EZImage, Modal } from '../../common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';

interface Props {
  data: ERC721CardData;
  modalOpen: boolean;
  setModalOpen: (set: boolean) => void;
}

export const TokenCardModal = ({ data, modalOpen, setModalOpen }: Props): JSX.Element => {
  const title = data?.title ?? '';
  const tokenId = data?.tokenId ?? '';

  return (
    <Modal isOpen={modalOpen} showActionButtons={false} onClose={() => setModalOpen(false)}>
      <div onClick={() => setModalOpen(false)}>
        <EZImage src={data?.image} className="h-96 w-full" />

        <div className="p-4">
          <div className="font-bold">{title}</div>
          <div>{tokenId}</div>
        </div>
      </div>
    </Modal>
  );
};
