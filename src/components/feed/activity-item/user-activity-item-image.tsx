import { EZImage, NextLink } from 'src/components/common';

export const UserActivityItemImage = (props: { src: string; relativeLink: string }) => {
  return (
    <NextLink href={`${props.relativeLink}`}>
      <EZImage src={props.src} className="w-16 h-16 rounded-2xl overflow-clip" />
    </NextLink>
  );
};
