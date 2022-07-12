import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'src/components/common';
import { ellipsisAddress, ETHERSCAN_BASE_URL } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';

interface Props {
  title: string;
  txHash: string;
  onClose: () => void;
}

export const WaitingForTxModal = ({ title, txHash, onClose }: Props) => {
  const { providerManager } = useAppContext();
  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | undefined>(undefined);

  const waitForTransaction = async () => {
    console.log('waitForTransaction', txHash);
    if (txHash) {
      const provider = providerManager?.getEthersProvider();
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
      cancelButton="" // hides cancel
      okButton="Done"
      title={<div className="w-full flex justify-center">{title}</div>}
    >
      <div>
        {transactionReceipt ? (
          <div className="py-6 text-center">Transaction confirmed.</div>
        ) : (
          <>
            <div className="py-6 text-center">Waiting for blockchain confirmation...</div>
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
