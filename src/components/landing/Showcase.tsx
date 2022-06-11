import { twMerge } from 'tailwind-merge';
import { Heading } from '../common/heading';

export interface Props {
  title: string;
  subtitle: string;
}

export const ShowCase: React.FC<Props> = ({ subtitle, title, children }) => {
  return (
    <article className="text-center space-y-2">
      <Heading as="h2" className="font-body font-medium">
        {title}
      </Heading>
      <SubTitle className="!mb-20">{subtitle}</SubTitle>
      {children}
    </article>
  );
};

export const SubTitle: React.FC<{ className?: string }> = ({ children, className }) => {
  // NOTE: we don't have an exact 'grey' color like on the design, so gray-500 is used here instead
  return <p className={twMerge('font-body font-normal text-gray-500', className)}>{children}</p>;
};
