import flowLogo from 'src/images/flow-logo.png';
import { CenteredContent } from './centered-content';
import { EZImage } from './ez-image';

export const BouncingLogo = () => {
  return (
    <CenteredContent>
      <EZImage src={flowLogo.src} className="w-9 h-9 animate-bounce" />
    </CenteredContent>
  );
};
