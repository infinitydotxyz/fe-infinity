import React, { FunctionComponent } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { EZImage } from '../common';
import profileEditBg from 'src/images/profile/profile-edit-bg.png';

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
      className="overflow-hidden bg-theme-gray-100 w-32 h-32"
      style={{
        border: '3px solid rgb(251, 253, 255)',
        boxShadow: 'rgb(14 14 14 / 60%) 0px 0px 2px 0px',
        borderRadius: '50%'
      }}
    >
      {imgSrc ? (
        <EZImage src={imgSrc} />
      ) : (
        <div
          className={`relative w-full h-full flex flex-row items-center justify-center bg-theme-gray-100 ${
            isOwner ? 'hover:bg-theme-gray-200 cursor-pointer' : ''
          }`}
          onClick={handleClick}
        >
          <EZImage src={profileEditBg.src} />
          <FaUserEdit className="w-14 h-14 ml-2 absolute opacity-60" />
        </div>
      )}
    </div>
  );
};
