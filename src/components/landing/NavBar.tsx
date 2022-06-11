import { pageStyles, NextLink, SVG, Spacer } from '../common';
import { ButtonJoin } from './ButtonJoin';
import { DiscordIconLink, TwitterIconLink } from './Icons';

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

        <DiscordIconLink />
        <TwitterIconLink />
        <ButtonJoin>Try Beta</ButtonJoin>
      </nav>
    </header>
  );
};
