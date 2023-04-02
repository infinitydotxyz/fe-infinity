import { useEffect, useState } from 'react';
import flowLogo from 'src/images/flow-logo-mark.png';
import { CenteredContent } from './centered-content';
import { AImage } from '../astra/astra-image';

export const BouncingLogo = () => {
  return (
    <CenteredContent>
      <AImage src={flowLogo.src} className="w-9 h-9 animate-bounce" />
    </CenteredContent>
  );
};

// splash screen with sound - currently unused
export const SplashScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio('/sounds/splash.mp3');
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener('canplaythrough', () => {
        setIsLoaded(true);
      });
      audio.removeEventListener('ended', () => {
        setIsPlaying(false);
      });
    };
  }, []);

  useEffect(() => {
    if (isLoaded && !isPlaying) {
      const audio = new Audio('/sounds/splash.mp3');
      audio.play();
      setIsPlaying(true);
    }
  }, [isLoaded, isPlaying]);

  return (
    <CenteredContent>
      <AImage src={flowLogo.src} className="w-9 h-9 animate-bounce" />
    </CenteredContent>
  );
};
