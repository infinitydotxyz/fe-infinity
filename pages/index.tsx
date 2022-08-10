import Image from 'next/image';
import React from 'react';
import { Header, Heading, NextLink, pageStyles, Spacer, SVG } from 'src/components/common';
import { ShowCase, SubTitle } from 'src/components/landing/Showcase';
import SnipingEngineImage from 'src/images/landing/showcase_sniping_engine.png';
import OrdersImage from 'src/images/landing/showcase_set_orders.png';
import CollectionWideOrdersImage from 'src/images/landing/showcase_collection_wide_orders.png';
import TraitLevelOrdersImage from 'src/images/landing/showcase_trait_level_orders.png';
import LimitOrdersImage from 'src/images/landing/showcase_limit_orders.png';
import { ButtonJoin } from 'src/components/landing/ButtonJoin';
import { DiscordIconLink, InstagramIconLink, MediumIconLink, TwitterIconLink } from 'src/components/landing/Icons';
import { Banner } from 'src/components/landing/Banner';
import { useRouter } from 'next/router';
import { CgMouse } from 'react-icons/cg';

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-clip justify-items-center">
      <Header title="" />

      <header className="relative h-screen">
        <Banner>Our contracts have undergone multiple audits including public audits on Code4Arena and Immunefi</Banner>
        <HomeNavBar />

        <section className="text-center flex flex-col justify-center items-center h-4/6 space-y-4">
          <Heading className="font-body text-4xl md:text-6xl md:leading-tight font-medium">
            The easiest way to <br /> trade NFTs
          </Heading>
          <SubTitle className="font-heading">Buy &amp; sell with new advanced orders and flexible pricing</SubTitle>
          <ButtonJoin
            onClick={() => {
              window.open('https://www.premint.xyz/infinity-marketplace-v2-beta-allowlist/');
            }}
          >
            Sign up for beta
          </ButtonJoin>
        </section>

        <CgMouse className="text-gray-600  mx-auto absolute bottom-10 right-0 left-0 w-8 h-8" />
      </header>

      <main className={`${pageStyles} w-full space-y-20`}>
        <ShowCase
          title="Auto-sniping"
          subtitle="Fulfill orders automatically without user intervention on matching trades"
          className="mt-0"
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

        <ShowCase
          title="Modular & extendable"
          subtitle="Deploy your own order execution strategies with our smart contracts"
          className="my-20"
        />
      </main>

      <section className="p-32 text-center bg-black space-y-10">
        <Heading as="h2" className="text-white text-4xl md:text-6xl md:leading-tight font-body font-normal">
          Start trading like <br /> the pros
        </Heading>
        <ButtonJoin
          variant="gray"
          size="large"
          onClick={() => {
            router.push('/trending');
          }}
        >
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
const HomeNavBar = () => {
  const router = useRouter();
  return (
    <nav className={`${pageStyles} bg-transparent font-heading flex space-x-6 items-center py-6 w-full`}>
      <NextLink href="/">
        <SVG.logo className="h-8 hidden sm:inline-block" />
        <SVG.miniLogo className="h-8 inline-block sm:hidden" />
      </NextLink>

      <Spacer />

      <DiscordIconLink />
      <TwitterIconLink />
      <ButtonJoin
        onClick={() => {
          router.push('/trending');
        }}
      >
        Try beta
      </ButtonJoin>
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className={`${pageStyles} p-5 md:p-20`}>
      <p className="font-body w-[346px]">
        Infinity is building tools and infrastructure for culture exchange. Join us on discord to find out more and
        contribute. We are on a mission to onboard 100M people to NFTs.
      </p>
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-2 mt-20">
        <div className="flex space-x-4">
          <DiscordIconLink />
          <MediumIconLink />
          <span className="mt-1">
            <TwitterIconLink />
          </span>
          <InstagramIconLink />
        </div>
        <div className="flex space-x-4">
          <NextLink href="/terms" className="underline">
            Terms of Service
          </NextLink>
          <NextLink href="/privacy-policy" className="underline">
            Privacy Policy
          </NextLink>
        </div>
      </div>
    </footer>
  );
};
