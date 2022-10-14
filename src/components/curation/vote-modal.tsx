import { UserCuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto';
import { CurationQuotaDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curation-quota.dto';
import { sleep } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { AvatarImage } from '../collection/avatar-image';
import { Button, ButtonProps, Chip, Divider, Heading, Modal, Spinner, TextInputBox, toastError } from '../common';
import { MaxButton } from './max-button';
import { FeesAccruedStats, FeesAprStats, Statistics } from './statistics';
import { VoteProgressBar } from './vote-progress-bar';

export const StakeTokensButton: React.FC<Pick<ButtonProps, 'variant'>> = ({ variant }) => {
  const router = useRouter();

  return (
    <Button variant={variant} size="large" className="w-full" onClick={() => router.push('/rewards')}>
      Stake tokens to get votes
    </Button>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  collection: UserCuratedCollectionDto;
}

export const VoteModal: React.FC<Props> = ({ collection, isOpen, onClose }) => {
  const { user, chainId } = useOnboardContext();

  // TODO: re-calculate fees & APR (via API call) when 'votes' change
  const [votes, setVotes] = useState<number>(0);
  const { result: quota, isLoading: isLoadingQuota, mutate: mutateQuota } = useUserCurationQuota();
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const isMounted = useIsMounted();

  const votesAvailable = quota?.availableVotes || 0;

  const vote = async () => {
    setHasVoted(false);
    setIsVoting(true);

    try {
      const { error } = await apiPost(
        `/collections/${collection.chainId}:${collection.address}/curated/${chainId}:${user?.address}`,
        { data: { votes } }
      );

      if (error) {
        toastError(error?.errorResponse?.message);
        return;
      }

      await mutateQuota(
        (data: CurationQuotaDto) =>
          ({
            availableVotes: data.availableVotes - votes
          } as CurationQuotaDto),
        { revalidate: false }
      );
    } catch (err) {
      console.error(err);
      toastError('Something went wrong. Please try again later.');
    }

    if (isMounted()) {
      setHasVoted(true);
      setIsVoting(false);
      setVotes(0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={async () => {
        onClose();
        await sleep(300); // hack to makes sure the modal is hidden before resseting 'hasVoted' state
        setHasVoted(false);
      }}
      showCloseIcon
      showActionButtons={false}
      wide={false}
    >
      <div className="space-y-4">
        <AvatarImage url={collection.profileImage} />
        <Heading as="h3" className="font-body text-3xl font-medium">
          {collection.name}
        </Heading>
      </div>

      {hasVoted && (
        <>
          <div className="bg-green-100 rounded-lg py-5 px-6 mb-4 mt-4 text-base text-green-700" role="alert">
            <strong>Votes have been registered successfully! Changes will be visible shortly.</strong>
          </div>
          <Chip
            onClick={() => {
              const win = window.open(
                `https://twitter.com/intent/tweet?url=https://infinity.xyz/collection/${collection.slug}&text=I just curated ${collection.name} on Infinity! Come check it out at `,
                '_blank'
              );
              win?.focus();
            }}
            content={<FaTwitter />}
            title="click to tweet"
            right={<span className="ml-2">Share on twitter</span>}
          />
        </>
      )}

      {!hasVoted && isLoadingQuota && <Spinner />}

      {!hasVoted && !isLoadingQuota && (
        <>
          <div className="my-8 space-y-2 font-body">
            <FeesAprStats value={collection.feesAPR || 0} className="flex flex-row-reverse justify-between" />
            <FeesAccruedStats value={collection.fees || 0} className="flex flex-row-reverse justify-between" />
          </div>
          <div className="my-8">
            <VoteProgressBar
              votes={(collection.curator?.votes || 0) + votes}
              totalVotes={(collection.numCuratorVotes || 0) + votes}
              className="bg-gray-100"
            />
          </div>
          <Divider className="my-6" />
          <div className="space-y-4">
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
                  onChange={(v) => {
                    const parsedNumber = v !== '' ? parseInt(v) : 0;

                    if (isNaN(parsedNumber) || parsedNumber > votesAvailable) {
                      return;
                    }

                    setVotes(parsedNumber);
                  }}
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
            <div className="text-secondary text-sm font-light font-heading">
              Votes cannot be reallocated to prevent 'vote rotation'. See{' '}
              <a
                href="https://docs.infinity.xyz/gm/features/curation#view-your-curated-collections"
                target="_blank"
                className="underline"
              >
                docs
              </a>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
