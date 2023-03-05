import { Modal } from './modal';
import UniswapWidget, { UniswapModalProps } from './uniswap-widget';

interface Props extends UniswapModalProps {
  title: string;
  onClose: () => void;
}

export const UniswapModal = ({ title, onClose, ...props }: Props) => {
  return (
    <Modal isOpen={true} onClose={onClose} title={title} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <div className="mt-2 w-100 flex items-center justify-center" style={{ minWidth: '352px', minHeight: '352px' }}>
          <UniswapWidget {...props} />
        </div>
      </div>
    </Modal>
  );
};
