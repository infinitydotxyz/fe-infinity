import { FunctionComponent } from 'react';
import { FaPen } from 'react-icons/fa';
import clsx from 'classnames';

interface ProfileImageProps {
  className?: string;
}

export const ProfileImage: FunctionComponent<ProfileImageProps> = ({ className }) => {
  return (
    <div
      className={clsx('overflow-hidden bg-theme-light-200', className)}
      style={{
        border: '3px solid rgb(251, 253, 255)',
        boxShadow: 'rgb(14 14 14 / 60%) 0px 0px 2px 0px',
        borderRadius: '50%'
      }}
    >
      <div className="w-full h-full flex flex-row items-center justify-center">
        <FaPen className=" -mt-0.5" />
      </div>
      <img alt="" className="object-cover" />
    </div>
  );
};
