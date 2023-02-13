import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { useEffect, useState } from 'react';
import { Button, Modal, BouncingLogo } from 'src/components/common';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { useNetwork, useProvider } from 'wagmi';

interface Props {
  title: string;
  txHash: string;
  onClose: () => void;
}

export const WaitingForTxModal = ({ title, txHash, onClose }: Props) => {
  const provider = useProvider();
  const { chain } = useNetwork();
  const chainId = String(chain?.id) ?? '1';

  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | undefined>(undefined);

  const waitForTransaction = async () => {
    if (txHash) {
      const receipt = await provider?.waitForTransaction(txHash);
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
              <BouncingLogo />
            </div>
          </>
        )}

        <div className="py-6 text-center">
          <a href={`${getChainScannerBase(chainId)}/tx/${txHash}`} target="_blank" className="underline">
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
