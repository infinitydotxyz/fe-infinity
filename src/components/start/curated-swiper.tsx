import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// https://swiperjs.com/react#usage-with-create-react-app

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from './swiper.module.scss';
import { EZImage, SVG } from '../common';
import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/router';

interface Props {
  collections: CuratedCollectionDto[][];
}

export const CuratedSwiper = ({ collections }: Props) => {
  const curatedCollections = collections.flat();
  const router = useRouter();

  return (
    <div className="    ">
      <Swiper
        // autoHeight={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
          //   reverseDirection: true,
          //   stopOnLastSlide: false
        }}
        // install Swiper modules
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
        className={styles.swpr}
        loop={true}
        // loopedSlides={2}
        // loopAdditionalSlides={3}
        // loopedSlidesLimit={true}

        navigation
        pagination={{ clickable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
      >
        {curatedCollections.map((collection) => {
          return (
            <SwiperSlide className=" " key={collection.address}>
              <CuratedSwiperCard
                collection={collection}
                onClick={() => router.push(`/collection/${collection.slug}`)}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

// ==========================================================================================

type Props2 = {
  collection: CuratedCollectionDto;
  onClick: () => void;
};

const CuratedSwiperCard: React.FC<Props2> = ({ collection, onClick }) => {
  return (
    <div
      className={twMerge(
        ' mx-1 mb-2 pb-1 aspect-1  flex flex-col cursor-pointer  relative   ',
        'overflow-clip rounded-2xl   shadow-md shadow-slate-200 pointer-events-auto'
      )}
      onClick={onClick}
    >
      <div className="flex-1    ">
        <EZImage src={collection.bannerImage} className="border  shrink-0  " />
      </div>

      <div className="flex relative   px-5 py-2 items-center">
        <div className=" p-1 bg-white shadow-md shadow-slate-200 rounded-xl -mt-6   ">
          <EZImage
            src={collection.profileImage}
            className="border rounded-xl overflow-clip shrink-0 w-16 h-16  bg-gray-300"
          />
        </div>

        <div className="text-theme-light-900 font-bold text-md ml-4 flex items-center">
          {collection.name} {collection.hasBlueCheck && <SVG.blueCheck className="h-5 w-5 ml-1.5" />}
        </div>
      </div>
    </div>
  );
};
