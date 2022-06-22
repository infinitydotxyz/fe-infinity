import { BaseCollection, CuratedCollection } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { apiPost } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { AvatarImage } from '../collection/avatar-image';
import { Button, Divider, Heading, Modal, TextInputBox, toastError } from '../common';
import { FeesAccruedStats, FeesAprStats, Statistics } from './statistics';
import { VoteProgressBar } from './vote-progress-bar';

export type VoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVote: (votes: number) => void;
  collection: BaseCollection;
  curated: CuratedCollection | null;
};

export const VoteModal: React.FC<VoteModalProps> = ({ collection, curated, isOpen, onClose, onVote }) => {
  const { user } = useAppContext();
  const [votes, setVotes] = useState(0);

  // TODO: re-calculate fees & APR (via API call) when 'votes' change
  // TODO: use available votes from contract hook
  const votesAvailable = 120_350;

  const vote = async () => {
    const { error } = await apiPost(
      `/collections/${collection.chainId}:${collection.address}/curated/${user?.address}`,
      { data: { votes } }
    );

    if (error) {
      toastError(error?.errorResponse?.message);
      return;
    }

    onVote(votes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseIcon showActionButtons={false}>
      <div className="space-y-4">
        <AvatarImage url={collection.metadata.profileImage} alt="avatar" />
        <Heading as="h3" className="font-body">
          {collection.metadata?.name}
        </Heading>
      </div>

      <div className="my-8 font-body">
        {/* TODO: re-calculate these on change */}
        <FeesAprStats value={curated?.feesAPR || 0} className="flex flex-row-reverse justify-between" />
        <FeesAccruedStats value={curated?.fees || 0} className="flex flex-row-reverse justify-between" />
      </div>

      <div className="my-8">
        <VoteProgressBar votes={(curated?.votes || 0) + votes} totalVotes={(collection.numCuratorVotes || 0) + votes} />
      </div>

      <Divider className="my-10" />

      <div className="space-y-4">
        <Statistics value={votesAvailable} className="flex flex-row-reverse justify-between" label="Votes available" />
        {votesAvailable > 0 && (
          <>
            <TextInputBox
              label="Votes"
              type="text"
              placeholder="0.00"
              value={votes.toString()}
              bindValue
              onChange={(v) => !isNaN(parseInt(v)) && setVotes(parseInt(v))}
              renderRightIcon={() => (
                <Button variant="gray" size="small" onClick={() => setVotes(votesAvailable)}>
                  Max
                </Button>
              )}
            />
            <Button className="w-full" onClick={vote}>
              Vote
            </Button>
          </>
        )}
        {votesAvailable === 0 && (
          <>
            <Button className="w-full">Buy tokens on Uniswap</Button>
            <Button className="w-full">Stake tokens to get votes</Button>
          </>
        )}
      </div>
    </Modal>
  );
};
