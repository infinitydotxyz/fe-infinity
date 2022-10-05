import { useState } from 'react';
import { Button, Modal, PageBox, toastError, toastSuccess, ToggleTab, useToggleTab } from 'src/components/common';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useRouter } from 'next/router';
import { AllCuratedCollections } from 'src/components/curation/all-curated';
import { Sort } from 'src/components/curation/sort';
import { MyCuratedCollections } from 'src/components/curation/my-curated';
import { CuratedTab } from 'src/components/curation/types';
import { useCurationBulkVoteContext } from 'src/utils/context/CurationBulkVoteContext';
import { apiPost } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export default function Curation() {
  const { chainId, user } = useOnboardContext();
  const [orderBy, setOrderBy] = useState(CuratedCollectionsOrderBy.Votes);
  const [modalOpen, setModalOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const tabs = [CuratedTab.AllCurated, CuratedTab.MyCurated];
  const router = useRouter();
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'My Curated');
  const { votesQuota, votes, reset } = useCurationBulkVoteContext();

  const voteCount = Object.values(votes).reduce((x, y) => x + y, 0);
  const collectionCount = Object.keys(votes).length;

  const closeModal = () => setModalOpen(false);
  const showModal = () => setModalOpen(collectionCount > 0);
  const submit = async () => {
    setIsVoting(true);

    const { error } = await apiPost(`/collections/curated/${chainId}:${user?.address}`, {
      data: Object.keys(votes).map((collection) => ({
        collection,
        votes: votes[collection]
      }))
    });

    if (error) {
      toastError(error?.errorResponse?.message);
    } else {
      toastSuccess('Votes registered successfully. Your votes will reflect shortly (~ 2 minutes).');
      reset();
    }

    setIsVoting(false);
    closeModal();
  };

  return (
    <PageBox title="Curated">
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onOKButton={submit}
        disableOK={isVoting}
        onCancelButton={closeModal}
        title="Submit votes in bulk"
      >
        <span>Are you sure you want to spend a total of</span> <strong>{voteCount}</strong>{' '}
        <span>vote{voteCount > 1 ? 's' : ''} on</span> <strong>{collectionCount}</strong>{' '}
        <span>collection{collectionCount > 1 ? 's' : ''}?</span>
      </Modal>
      <div className="flex justify-between mb-8">
        <div className="mt-4">
          <span className="p-4 border border-gray-300 rounded-3xl mr-2">
            <strong className="mr-2">{votesQuota}</strong>
            <span>votes available</span>
          </span>
          {collectionCount > 0 && <Button onClick={showModal}>Confirm</Button>}
        </div>
        <div className="flex flex-row">
          <ToggleTab
            className="font-heading pointer-events-auto"
            options={options}
            selected={selected}
            onChange={onChange}
          />
          <Sort onClick={setOrderBy} />
        </div>
      </div>
      <div>
        {selected === CuratedTab.AllCurated && <AllCuratedCollections orderBy={orderBy} />}
        {selected === CuratedTab.MyCurated && <MyCuratedCollections orderBy={orderBy} />}
      </div>
    </PageBox>
  );
}
