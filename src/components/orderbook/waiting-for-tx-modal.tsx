import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'src/components/common';
import { ellipsisAddress, ETHERSCAN_BASE_URL } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';

interface Props {
  title: string;
  txHash: string;
  onClose: () => void;
}

export const WaitingForTxModal = ({ title, txHash, onClose }: Props) => {
  const { getEthersProvider } = useOnboardContext();

  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | undefined>(undefined);

  const waitForTransaction = async () => {
    console.log('waitForTransaction', txHash);
    if (txHash) {
      const provider = getEthersProvider();
      const receipt = await provider?.waitForTransaction(txHash);
      console.log('waitForTransaction result', receipt);
      setTransactionReceipt(receipt);
    }
  };

  useEffect(() => {
    waitForTransaction();
  }, [txHash]);

  return (
    <Modal
      wide={false}
      isOpen={true}
      showActionButtons={false}
      showCloseIcon={true}
      onClose={() => onClose()}
      title={title}
    >
      <div>
        {transactionReceipt ? (
          transactionReceipt.status === 1 ? (
            <div className="py-6 text-center">Transaction confirmed</div>
          ) : (
            <div className="py-6 text-center">Transaction failed</div>
          )
        ) : (
          <>
            <div className="py-6 text-center font-heading">Waiting for txn confirmation</div>
            <div className="flex justify-center">
              <Spinner />
            </div>
          </>
        )}

        <div className="py-6 text-center">
          <a href={`${ETHERSCAN_BASE_URL}/tx/${txHash}`} target="_blank" className="underline">
            View transaction {ellipsisAddress(txHash)}
          </a>
        </div>

        {transactionReceipt ? (
          <div className="flex justify-around">
            <Button variant="primary" className="py-3" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
