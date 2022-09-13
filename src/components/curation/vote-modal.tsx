import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { CurationQuotaDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curation-quota.dto';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { AvatarImage } from '../collection/avatar-image';
import { Button, ButtonProps, Divider, Heading, Modal, Spinner, TextInputBox, toastError } from '../common';
import { MaxButton } from './max-button';
import { FeesAccruedStats, FeesAprStats, Statistics } from './statistics';
import { VoteProgressBar } from './vote-progress-bar';

export type VoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVote: (votes: number) => Promise<void> | void;
  collection: CuratedCollectionDto;
};

export const StakeTokensButton: React.FC<Pick<ButtonProps, 'variant'>> = ({ variant }) => {
  const router = useRouter();

  return (
    <Button variant={variant} size="large" className="w-full" onClick={() => router.push('/rewards')}>
      Stake tokens to get votes
    </Button>
  );
};

export const VoteModal: React.FC<VoteModalProps> = ({ collection, isOpen, onClose, onVote }) => {
  const { user, chainId } = useOnboardContext();

  // TODO: re-calculate fees & APR (via API call) when 'votes' change
  const [votes, setVotes] = useState(0);
  const { result: quota, isLoading: isLoadingQuota, mutate: mutateQuota } = useUserCurationQuota();
  const [isVoting, setIsVoting] = useState(false);

  const votesAvailable = quota?.availableVotes || 0;

  const vote = async () => {
    setIsVoting(true);

    const { error } = await apiPost(
      `/collections/${collection.chainId}:${collection.address}/curated/${chainId}:${user?.address}`,
      { data: { votes } }
    );

    if (error) {
      toastError(error?.errorResponse?.message);
      return;
    }

    // TODO: improve these reflective changes to UI (this looks glitchy atm)
    await onVote(votes);
    await mutateQuota(
      (data: CurationQuotaDto) =>
        ({
          availableVotes: data.availableVotes - votes
        } as CurationQuotaDto)
    );
    setVotes(0);
    onClose();
    setIsVoting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseIcon showActionButtons={false} wide={false}>
      <div className="space-y-4">
        <AvatarImage url={collection.profileImage} />
        <Heading as="h3" className="font-body text-3xl font-medium">
          {collection.name}
        </Heading>
      </div>

      {isLoadingQuota && <Spinner />}

      {!isLoadingQuota && (
        <>
          <div className="my-8 space-y-2 font-body">
            {/* TODO: re-calculate these on change */}
            <FeesAprStats value={collection.feesAPR || 0} className="flex flex-row-reverse justify-between" />
            <FeesAccruedStats value={collection.fees || 0} className="flex flex-row-reverse justify-between" />
          </div>
          <div className="my-8">
            <VoteProgressBar
              votes={(collection.votes || 0) + votes}
              totalVotes={(collection.numCuratorVotes || 0) + votes}
            />
          </div>
          <Divider className="my-10" />
          <div className="space-y-8">
            <Statistics
              value={votesAvailable}
              className="flex flex-row-reverse justify-between"
              label="Votes available"
            />
            {votesAvailable > 0 && (
              <>
                <TextInputBox
                  label="Votes"
                  type="text"
                  placeholder="0.00"
                  value={votes.toString()}
                  onChange={(v) => !isNaN(parseInt(v)) && setVotes(parseInt(v))}
                  renderRightIcon={() => (
                    <MaxButton variant="gray" onClick={() => setVotes(votesAvailable)}></MaxButton>
                  )}
                />
                <Button size="large" className="w-full" onClick={vote} disabled={isLoadingQuota || isVoting}>
                  Vote
                </Button>
              </>
            )}
            {votesAvailable === 0 && (
              <>
                <Button size="large" className="w-full">
                  Buy tokens on Uniswap
                </Button>
                <StakeTokensButton />
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
