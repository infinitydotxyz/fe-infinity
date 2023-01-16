import { standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const UserActivityItem = ({ avatar, title, children }: Props) => {
  return (
    <div className={twMerge(standardBorderCard, 'flex items-center overflow-hidden')}>
      {avatar}
      <div className="w-full mx-8 ml-4 flex items-center overflow-none">
        <div className="mr-4">{title}</div>
        <div className="w-full flex flex-row justify-between items-center">{children}</div>
      </div>
    </div>
  );
};
