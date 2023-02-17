import { FaPlay } from 'react-icons/fa';
import { dropShadow, hoverColor, primaryBtnBgColorText } from 'src/utils/ui-constants';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { twMerge } from 'tailwind-merge';
import { Button, Modal } from '.';
import Lottie from 'lottie-react';
import buyAnywhere from 'src/lotties/buyAnywhere.json';
import frontRunProtection from 'src/lotties/frontRunProtection.json';
import matchingEngine from 'src/lotties/matchingEngine.json';
import fastSnipe from 'src/lotties/fastSnipe.json';
import readableSign from 'src/lotties/readableSign.json';
import txnFreeUX from 'src/lotties/txnFreeUX.json';
import { useRouter } from 'next/router';

interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const SnipeModal = ({ modalOpen, setModalOpen }: Props): JSX.Element | null => {
  const router = useRouter();

  return (
    <Modal
      isOpen={modalOpen}
      showActionButtons={false}
      onClose={() => {
        if (event instanceof PointerEvent) {
          event.stopPropagation();
          event.preventDefault();
        }
        setModalOpen(false);
      }}
      title="Auto Snipe"
      titleClassName="justify-center text-2xl"
      panelClassName={twMerge('max-w-2xl rounded-lg', dropShadow)}
    >
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true
        }}
        navigation={{
          prevEl: '.prev',
          nextEl: '.next'
        }}
        modules={[Pagination, Navigation]}
        className="h-96"
      >
        <div className="prev absolute top-1/2 left-0 z-10">
          <Button variant="round" className="transform rotate-180">
            <FaPlay className="h-5 w-5" />
          </Button>
        </div>
        <div className="next absolute top-1/2 right-0 z-10">
          <Button variant="round">
            <FaPlay className="h-5 w-5" />
          </Button>
        </div>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="text-lg">Bid Once. Buy from anywhere.</div>
            <Lottie animationData={buyAnywhere} loop={true} style={{ height: 180 }} />
            <div className="w-3/4 text-center">
              Automatically snipe NFTs from all marketplaces. Auto-sniping from Flow and Opensea is currently live with
              more coming soon.
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="text-lg">Readable Bulk signatures</div>
            <Lottie animationData={readableSign} loop={true} style={{ height: 180 }} />
            <div className="w-3/4 text-center">
              Place multiple bids/listings with a single signature. Flow supports bulk signatures that you can actually
              read.
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="text-lg">Txn free UX</div>
            <Lottie animationData={txnFreeUX} loop={true} style={{ height: 180 }} />
            <div className="w-3/4 text-center">
              Flow offers a txn free UX. All orders are automatically executed by our matching engine.
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="text-lg">Matching engine</div>
            <Lottie animationData={matchingEngine} loop={true} style={{ height: 180 }} />
            <div className="w-3/4 text-center">
              Flow comes loaded with a matching engine that automatically matches your orders. Every collection has it's
              own matching engine instance, enabling sharded execution.
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="text-lg">Millisecond snipes</div>
            <Lottie animationData={fastSnipe} loop={true} style={{ height: 180 }} />
            <div className="w-3/4 text-center">
              Flow's matching engine finds orders to snipe in mere milliseconds, allowing you to snipe NFTs that are on
              sale for a bargain before anyone else.
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="text-lg">Frontrunning protection</div>
            <Lottie animationData={frontRunProtection} loop={true} style={{ height: 180 }} />
            <div className="w-3/4 text-center">
              Flow uses Flashbots to relay transactions to chain. This enables you to snipe NFTs without worrying about
              frontrunning.
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="flex items-center justify-center">
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div
              className={twMerge(
                'p-4 cursor-pointer rounded-lg transition ease-in-out duration-300',
                primaryBtnBgColorText,
                hoverColor
              )}
              onClick={() => {
                setModalOpen(false);
                router.push('/trending');
              }}
            >
              Explore Collections
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </Modal>
  );
};
