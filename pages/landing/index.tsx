import { useRouter } from 'next/router';
import React from 'react';
import { Button, ExternalLink, Header, NextLink, pageStyles, Spacer, SVG } from 'src/components/common';

const HomePage = () => {
  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden justify-items-center">
      <Header title="Landing Page">
        <NavBar />
        <div className={`transition ${pageStyles} w-full`}>aa</div>
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
  const router = useRouter();

  return (
    <div className="w-full bg-white bg-opacity-70 glass font-heading">
      <div className={`${pageStyles} flex space-x-6 items-center py-6 w-full`}>
        <NextLink href="/">
          <SVG.logo className="h-8 hidden sm:inline-block" />
          <SVG.miniLogo className="h-8 inline-block sm:hidden" />
        </NextLink>

        <Spacer />

        <ExternalLink href="https://discord.gg/unwAnymWDN" rel="noreferrer">
          <SVG.discord className="h-8" />
        </ExternalLink>
        <ExternalLink href="https://twitter.com/infinitydotxyz" rel="noreferrer">
          <SVG.twitter className="h-8" />
        </ExternalLink>
        <Button onClick={() => router.push('/')}>Try Beta</Button>
      </div>
    </div>
  );
};
