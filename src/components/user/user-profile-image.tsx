import React, { FunctionComponent } from 'react';
import { FaPen } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface UserProfileImageProps {
  imgSrc?: string;
  isOwner?: boolean;
}

export const UserProfileImage: FunctionComponent<UserProfileImageProps> = ({ imgSrc, isOwner }) => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (isOwner) {
      router.push('/profile/settings');
    }
  };

  return (
    <div
      className="overflow-hidden bg-theme-grey-100 w-32 h-32"
      style={{
        border: '3px solid rgb(251, 253, 255)',
        boxShadow: 'rgb(14 14 14 / 60%) 0px 0px 2px 0px',
        borderRadius: '50%'
      }}
    >
      {imgSrc ? (
        <img className="object-cover" src={imgSrc} />
      ) : (
        <div
          className={`w-full h-full flex flex-row items-center justify-center ${
            isOwner ? 'hover:bg-theme-grey-200 cursor-pointer' : ''
          }`}
          onClick={handleClick}
        >
          {isOwner && <FaPen className=" -mt-0.5" />}
        </div>
      )}
    </div>
  );
};
