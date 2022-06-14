import { domAnimation, LazyMotion, m, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useOnScreen } from 'src/hooks/useOnScreen';
import { twMerge } from 'tailwind-merge';
import { Heading } from '../common/heading';

export interface Props {
  title: string;
  subtitle: string;
  className?: string;
}

export const ShowCase: React.FC<Props> = ({ subtitle, title, className, children }) => {
  const rootRef = useRef();
  const onScreen = useOnScreen(rootRef, '-30%');
  const animation = useAnimation();

  useEffect(() => {
    if (onScreen) {
      animation.start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut'
        }
      });
    }
  }, [onScreen, animation]);

  return (
    <LazyMotion features={domAnimation} strict>
      <m.article
        className={twMerge('text-center space-y-2', className)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={rootRef as any}
        initial={{ opacity: 0, y: -50 }}
        animate={animation}
      >
        <Heading as="h2" className="font-body text-4xl md:text-6xl md:leading-tight font-medium">
          {title}
        </Heading>
        <SubTitle className="!mb-10">{subtitle}</SubTitle>
        {children}
      </m.article>
    </LazyMotion>
  );
};

export const SubTitle: React.FC<{ className?: string }> = ({ children, className }) => {
  // NOTE: we don't have an exact 'grey' color like on the design, so gray-500 is used here instead
  return <p className={twMerge('font-body text-lg font-normal text-gray-500', className)}>{children}</p>;
};
