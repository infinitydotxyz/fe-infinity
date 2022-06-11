import Image from 'next/image';
import React from 'react';
import { Button, Header, Heading, NextLink, pageStyles, Spacer, SVG, TextInputBox } from 'src/components/common';
import { ShowCase, SubTitle } from 'src/components/landing/Showcase';
import SnipingEngineImage from 'src/images/landing/showcase_sniping_engine.png';
import OrdersImage from 'src/images/landing/showcase_set_orders.png';
import CollectionWideOrdersImage from 'src/images/landing/showcase_collection_wide_orders.png';
import TraitLevelOrdersImage from 'src/images/landing/showcase_trait_level_orders.png';
import LimitOrdersImage from 'src/images/landing/showcase_limit_orders.png';
import { ButtonJoin } from 'src/components/landing/ButtonJoin';
import { DiscordIconLink, InstagramIconLink, MediumIconLink, TwitterIconLink } from 'src/components/landing/Icons';
import { Divider } from 'src/components/landing/Divider';

const HomePage = () => {
  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden justify-items-center">
      <Header title="Landing Page" />

      <NavBar />

      <main className={`${pageStyles} w-full`}>
        <section className="text-center space-y-5">
          <Heading className="font-body font-medium">
            The easiest way to <br /> trade NFTs
          </Heading>
          <SubTitle>Buy & sell with new advanced orders and flexible pricing</SubTitle>
          <ButtonJoin>Sign up for beta</ButtonJoin>
        </section>

        <Divider />

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
        <Divider />

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
        <Divider />

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
        <Divider />

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
        <Divider />

        <ShowCase
          title="Modular & extendable"
          subtitle="Deploy your own order execution strategies with our smart contracts"
        />
      </main>

      <section className="p-32 text-center bg-black space-y-10">
        <Heading as="h2" className="text-white font-body font-normal">
          Start trading like <br /> the pros
        </Heading>
        <ButtonJoin variant="gray" size="large">
          Try beta
        </ButtonJoin>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

/**
 * Custom navbar to be used by the landing page only.
 * Note: we should probably try to make the main NavBar component more composable instead though.
 */
const NavBar = () => {
  return (
    <header className="w-full bg-white bg-opacity-70 glass font-heading">
      <nav className={`${pageStyles} flex space-x-6 items-center py-6 w-full`}>
        <NextLink href="/">
          <SVG.logo className="h-8 hidden sm:inline-block" />
          <SVG.miniLogo className="h-8 inline-block sm:hidden" />
        </NextLink>

        <Spacer />

        <DiscordIconLink />
        <TwitterIconLink />
        <ButtonJoin>Try Beta</ButtonJoin>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className={`${pageStyles} p-5 md:p-20`}>
      <p className="font-body w-[346px]">
        Infinity is built by an A-team of crypto devs and operators. Join us on discord to find out more and contribute.
        We are on our way to becoming the largest DAO in the world.
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 mt-20">
        <div className="flex space-x-4 flex-1">
          <DiscordIconLink />
          <MediumIconLink />
          <TwitterIconLink />
          <InstagramIconLink />
        </div>
        <div className="flex space-x-2 flex-1">
          <TextInputBox label="" type="text" placeholder="email" isFullWidth />
          <Button>Subscribe</Button>
        </div>
      </div>
    </footer>
  );
};
