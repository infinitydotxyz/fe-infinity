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

const HomePage = () => {
  const theme = useTheme();
  const darkMode = theme.theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const router = useRouter();

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
      width: 1382,
      WebkitFilter: 'contrast(50)',
      filter: 'contrast(50)',
      mixBlendMode: 'screen',
      backgroundColor: themeToUse.bg,
      position: 'absolute'
    },
    heading: {
      whiteSpace: 'pre',
      WebkitFilter: 'blur(5px)',
      filter: 'blur(5px)',
      fontWeight: 400,
      fontStyle: 'normal',
      fontFamily: `"RubikMonoOne"`,
      color: themeToUse.body,
      fontSize: 100,
      letterSpacing: '0em',
      lineHeight: 1.2
    },
    subheading: {
      whiteSpace: 'pre',
      WebkitFilter: 'blur(1px)',
      filter: 'blur(1px)',
      fontWeight: 400,
      fontStyle: 'normal',
      fontFamily: `"RubikMonoOne"`,
      color: themeToUse.body,
      fontSize: 50,
      letterSpacing: '0em',
      lineHeight: 1.2
    },
    body: {
      whiteSpace: 'wrap',
      WebkitFilter: 'blur(0px)',
      filter: 'blur(0px)',
      fontWeight: 400,
      fontStyle: 'normal',
      color: themeToUse.body,
      fontSize: 20,
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
    <div style={classes.background} className="scrollbar-hide">
      <div className="flex flex-col items-center justify-center" style={classes.contrast}>
        <div style={classes.heading}>PIXL</div>

        <div className="w-1/2" style={classes.frame}>
          <Ticker duration={20} direction={1}>
            {images.map((image, index) => (
              <div
                key={index}
                style={{
                  margin: '25px',
                  height: '250px',
                  width: '200px'
                }}
              >
                <EZImage src={image.src} />
              </div>
            ))}
          </Ticker>
        </div>

        <div className="flex flex-col w-1/2 space-y-4 pb-60">
          <div style={classes.subheading}>THE LAST AGGREGATOR</div>
          <div style={classes.body}>
            Pixl is designed with a clear purpose - to enable a broader use of NFTs. We view NFTs as digital artifacts
            that can be used to store memories, express personality, and foster communities. We're working beyond the
            scope of typical 'creator'-launched collections to open up new possibilities.
          </div>
          <div className="h-1"></div>
          <AButton
            primary
            className={twMerge(`text-md p-4 hover:text-light-body dark:hover:text-dark-body`)}
            onClick={() => router.push('/trending')}
          >
            Explore
          </AButton>

          <div className="h-10"></div>
          <div style={classes.subheading}>THE LAST AGGREGATOR</div>
          <div style={classes.body}>
            Pixl is designed with a clear purpose - to enable a broader use of NFTs. We view NFTs as digital artifacts
            that can be used to store memories, express personality, and foster communities. We're working beyond the
            scope of typical 'creator'-launched collections to open up new possibilities.
          </div>

          <div style={classes.subheading}>THE LAST AGGREGATOR</div>
          <div style={classes.body}>
            Pixl is designed with a clear purpose - to enable a broader use of NFTs. We view NFTs as digital artifacts
            that can be used to store memories, express personality, and foster communities. We're working beyond the
            scope of typical 'creator'-launched collections to open up new possibilities.
          </div>

          <div style={classes.subheading}>THE LAST AGGREGATOR</div>
          <div style={classes.body}>
            Pixl is designed with a clear purpose - to enable a broader use of NFTs. We view NFTs as digital artifacts
            that can be used to store memories, express personality, and foster communities. We're working beyond the
            scope of typical 'creator'-launched collections to open up new possibilities.
          </div>

          <div style={classes.subheading}>THE LAST</div>
          <div style={classes.body}>
            Pixl is designed with a clear purpose - to enable a broader use of NFTs. We view NFTs as digital artifacts
            that can be used to store memories, express personality, and foster communities. We're working beyond the
            scope of typical 'creator'-launched collections to open up new possibilities.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
