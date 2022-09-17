import { useRouter } from 'next/router';
import { NextLink, pageStyles, Spacer, SVG } from 'src/components/common';
import { ButtonJoin } from 'src/components/landing/ButtonJoin';
import { DiscordIconLink, TwitterIconLink } from 'src/components/landing/Icons';

/**
 * Custom navbar to be used by the landing page only.
 * Note: we should probably try to make the main NavBar component more composable instead though.
 */
export const HomeNavBar = () => {
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
