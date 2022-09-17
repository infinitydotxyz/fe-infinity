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

      <Clouds />
      <div className="h-96">
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
