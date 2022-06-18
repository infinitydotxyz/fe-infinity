import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { AvatarImage } from '../collection/avatar-image';
import { Button, Divider, Heading, Modal, TextInputBox } from '../common';
import { FeesAccruedStats, FeesAprStats, Statistics } from './statistics';
import { VoteProgressBar } from './vote-progress-bar';

export type VoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  collection: BaseCollection;
};

export const VoteModal: React.FC<VoteModalProps> = ({ collection, isOpen, onClose: close }) => {
  const [votes, setVotes] = useState(0);

  // TODO: set available votes and stats from collection info

  const votesAvailable = 120_350;

  return (
    <Modal isOpen={isOpen} onClose={close} showCloseIcon showActionButtons={false}>
      <div className="space-y-4">
        <AvatarImage url={collection.metadata.profileImage} alt="avatar" />
        <Heading as="h3" className="font-body">
          {collection.metadata?.name}
        </Heading>
      </div>

      <div className="my-8 font-body">
        <FeesAprStats value={168} className="flex flex-row-reverse justify-between" />
        <FeesAccruedStats value={168} className="flex flex-row-reverse justify-between" />
      </div>

      <div className="my-8">
        <VoteProgressBar votes={80} totalVotes={100} />
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
            <Button className="w-full">Vote</Button>
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
