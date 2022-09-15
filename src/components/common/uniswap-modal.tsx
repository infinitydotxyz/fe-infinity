import { Heading } from './heading';
import { Modal } from './modal';
import dynamic from 'next/dynamic';
import { Spinner } from './spinner';

// eslint-disable-next-line node/no-unsupported-features/es-syntax
const DynamicUniswapWidget = dynamic(() => import('./uniswap-widget'), {
  ssr: false,
  loading: () => <Spinner />
});

interface Props {
  onClose: () => void;
}

export const UniswapModal = ({ onClose }: Props) => {
  return (
    <Modal isOpen={true} onClose={onClose} showActionButtons={false} showCloseIcon={true} wide={false}>
      <div>
        <Heading className="text-3xl -mt-8 font-medium font-body pl-2">Buy tokens</Heading>
        <div className="mt-2 w-100 flex items-center justify-center" style={{ minWidth: '352px', minHeight: '352px' }}>
          <DynamicUniswapWidget />
        </div>
      </div>
    </Modal>
  );
};
