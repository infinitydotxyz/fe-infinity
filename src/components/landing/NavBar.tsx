import { pageStyles, NextLink, SVG, Spacer, ExternalLink } from '../common';
import { ButtonTryBeta } from './ButtonTryBeta';

/**
 * Custom navbar to be used by the landing page only.
 * Note: we should probably try to make the main NavBar component more composable instead though.
 */
export const NavBar = () => {
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
