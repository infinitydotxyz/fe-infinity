import Ticker from 'framer-motion-ticker';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { AButton } from 'src/components/astra/astra-button';
import { EZImage } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import azuki from '../src/images/azuki.png';
import degod from '../src/images/degod.png';
import mayc from '../src/images/mayc.png';
import noun from '../src/images/noun.png';
import pengu from '../src/images/pengu.png';
import punk from '../src/images/punk.png';
import remilia from '../src/images/remilia.png';
import tailwindConfig from '../src/settings/tailwind/elements/foundations';
import NonSsrWrapper from 'src/components/astra/non-ssr-wrapper';
import lightLogo from 'src/images/light-logo.png';
import darkLogo from 'src/images/dark-logo.png';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const theme = useTheme();
  const darkMode = theme.theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const router = useRouter();

  const [logoSrc, setLogoSrc] = useState(darkLogo.src);

  useEffect(() => {
    if (theme.theme === 'dark') {
      setLogoSrc(darkLogo.src);
    } else {
      setLogoSrc(lightLogo.src);
    }
  }, [theme]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classes: any = {
    background: {
      flexShrink: 0,
      width: '100%',
      height: 1000,
      display: 'block',
      overflow: 'scroll',
      zIndex: 1,
      position: 'relative'
    },
    contrast: {
      width: '100%',
      WebkitFilter: 'contrast(50)',
      filter: 'contrast(50)',
      mixBlendMode: 'screen',
      backgroundColor: themeToUse.bg,
      position: 'absolute'
    },
    subheading: {
      whiteSpace: 'wrap',
      WebkitFilter: 'blur(1px)',
      filter: 'blur(1px)',
      color: themeToUse.body,
      letterSpacing: '0em',
      lineHeight: 1.2
    },
    body: {
      whiteSpace: 'wrap',
      color: themeToUse.body,
      fontSize: 16,
      letterSpacing: '0em',
      lineHeight: 1.2
    },
    frame: {
      height: 300,
      display: 'block',
      WebkitFilter: 'blur(7px)',
      filter: 'blur(7px)',
      overflow: 'visible'
    }
  };

  const images = [azuki, degod, noun, mayc, pengu, punk, remilia];

  return (
    <NonSsrWrapper>
      <div style={classes.background} className="scrollbar-hide">
        <div className="flex flex-col items-center justify-center" style={classes.contrast}>
          <EZImage src={logoSrc} className="md:w-40 md:h-40 w-32 h-32" />

          <div className="md:w-1/2 w-4/5">
            <Ticker duration={20} direction={1}>
              {images.map((image, index) => (
                <div key={index} className="w-32 h-44 md:w-48 md:h-60 md:m-6 m-4">
                  <EZImage src={image.src} />
                </div>
              ))}
            </Ticker>
          </div>

          <div className="flex flex-col md:w-1/2 w-4/5 space-y-4 md:pb-60 pb-80">
            <div style={classes.subheading} className="md:text-4xl text-2xl font-heading">
              THE LAST AGGREGATOR
            </div>
            <div style={classes.body}>
              <ul className="space-y-2 list-inside list-disc">
                <li>Listings from over 100 NFT marketplaces for instant buys.</li>
                <li>Bids from over 100 marketplaces for instant sells.</li>
                <li>Zero fees & royalties for token holders of $XFL, $BLUR, $LOOKS, $X2Y2, $SUDO.</li>
                <li>Gas free batch listings, bids & cancellations.</li>
                <li>Built on battle tested infra & audited contracts.</li>
                <li>Mega gas optimized.</li>
              </ul>
            </div>
            <div className="h-0"></div>
            <AButton
              primary
              className={twMerge(`text-md p-4 hover:text-light-body dark:hover:text-dark-body`)}
              onClick={() => router.push('/trending')}
            >
              Explore
            </AButton>

            <div className="h-2"></div>
            <div style={classes.subheading} className="md:text-4xl text-2xl font-heading">
              More soon
            </div>
            <div style={classes.body}>
              <ul className="space-y-2 list-inside list-disc">
                <li>Referrals.</li>
                <li>Token incentives.</li>
                <li>Multichain.</li>
                <li>L2 built for NFTs.</li>
                <li>&lt;super secret cool stuff&gt;.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </NonSsrWrapper>
  );
};

export default HomePage;
