import { useRouter } from 'next/router';
import React from 'react';
import { Button, ExternalLink, Header, Heading, NextLink, pageStyles, Spacer, SVG } from 'src/components/common';

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
            {/* NOTE: we don't have an exact 'grey' color like on the design, so gray-500 is used here instead */}
            <p className="font-body font-normal text-gray-500">
              Buy & sell with new advanced orders and flexible pricing
            </p>
            <ButtonTryBeta>Sign up for beta</ButtonTryBeta>
          </section>
          {/* TODO: content */}
          <article></article>
        </main>
      </Header>
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

        <ExternalLink href="https://discord.gg/unwAnymWDN" rel="noreferrer">
          <SVG.discord className="h-6" />
        </ExternalLink>
        <ExternalLink href="https://twitter.com/infinitydotxyz" rel="noreferrer">
          <SVG.twitter className="h-6" />
        </ExternalLink>
        <ButtonTryBeta>Try Beta</ButtonTryBeta>
      </nav>
    </header>
  );
};

const ButtonTryBeta: React.FC = ({ children }) => {
  const router = useRouter();
  return <Button onClick={() => router.push('/')}>{children}</Button>;
};
