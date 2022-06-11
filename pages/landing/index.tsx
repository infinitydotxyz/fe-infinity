import Image from 'next/image';
import React from 'react';
import { Header, Heading, pageStyles } from 'src/components/common';
import { ButtonTryBeta } from 'src/components/landing/ButtonTryBeta';
import { NavBar } from 'src/components/landing/NavBar';
import { ShowCase, SubTitle } from 'src/components/landing/Showcase';
import SnipingEngineImage from 'src/images/landing/showcase_sniping_engine.png';
import OrdersImage from 'src/images/landing/showcase_set_orders.png';
import CollectionWideOrdersImage from 'src/images/landing/showcase_collection_wide_orders.png';
import TraitLevelOrdersImage from 'src/images/landing/showcase_trait_level_orders.png';
import LimitOrdersImage from 'src/images/landing/showcase_limit_orders.png';

const HomePage = () => {
  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden justify-items-center">
      <Header title="Landing Page">
        <NavBar />
        <main className={`transition ${pageStyles} w-full`}>
          <section className="text-center space-y-5">
            <Heading className="font-body font-medium">
              The easiest way to <br /> trade NFTs
            </Heading>
            <SubTitle>Buy & sell with new advanced orders and flexible pricing</SubTitle>
            <ButtonTryBeta>Sign up for beta</ButtonTryBeta>
          </section>
          <ShowCase
            title="Auto-sniping engine"
            subtitle="Fulfill orders automatically without user intervention on matching trades"
          >
            <Image
              src={SnipingEngineImage.src}
              width={SnipingEngineImage.width}
              height={SnipingEngineImage.height}
              alt="auto-sniping engine"
            />
          </ShowCase>
          <ShowCase title="Set orders" subtitle="Make an order to buy one NFT from a selection of many NFTs">
            <Image src={OrdersImage.src} width={OrdersImage.width} height={OrdersImage.height} alt="set orders" />
          </ShowCase>
          <ShowCase
            title="Collection-wide orders"
            subtitle="Set a budget for a minimum number of NFTs to buy within a collection"
          >
            <Image
              src={CollectionWideOrdersImage.src}
              width={CollectionWideOrdersImage.width}
              height={CollectionWideOrdersImage.height}
              alt="collection-wide orders"
            />
          </ShowCase>
          <ShowCase
            title="Trait-level orders"
            subtitle="Set a budget to buy one NFT within a collection that has a specific trait"
          >
            <Image
              src={TraitLevelOrdersImage.src}
              width={TraitLevelOrdersImage.width}
              height={TraitLevelOrdersImage.height}
              alt="trait-level orders"
            />
          </ShowCase>
          <ShowCase
            title="Limit orders"
            subtitle="Set max budgets on buy orders and min acceptance prices on sell orders with prices varying over time"
          >
            <Image
              src={LimitOrdersImage.src}
              width={LimitOrdersImage.width}
              height={LimitOrdersImage.height}
              alt="limit orders"
            />
          </ShowCase>
        </main>
      </Header>
    </div>
  );
};

export default HomePage;
