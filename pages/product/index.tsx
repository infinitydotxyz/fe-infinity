import { WhatIs } from 'src/components/product/whatis';
import { HomeNavBar } from 'src/components/product/nav';
import { Clouds } from 'src/components/product/clouds';
import { AudioWave } from 'src/components/product/audio';
import { Burst1 } from 'src/components/product/burst1';
import { Burst2 } from 'src/components/product/burst2';
import { Burst3 } from 'src/components/product/burst3';

const ProductPage = () => {
  return (
    <div className="">
      <HomeNavBar />

      <div className="  relative ">
        <Clouds />

        <div
          className=" absolute top-14 right-0 left-0 bottom-0 text-center font-bold   text-white  "
          style={{ fontSize: '14vw', textShadow: '5px 10px 33px #00227766' }}
        >
          Infinity
        </div>
      </div>

      <div className=" ">
        <WhatIs />
      </div>
      <AudioWave />
      <div className="h-96"></div>

      <Burst1 />
      <Burst2 />

      <div className="w-full opacity-40">
        <Burst3 />
      </div>
    </div>
  );
};

export default ProductPage;
