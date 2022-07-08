import { FaPen } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { BGImage } from '../common';
import profileEditBg from 'src/images/profile/profile-edit-bg.png';

interface UserBannerImageProps {
  imgSrc?: string;
  isOwner?: boolean;
}

export const UserBannerImage = ({ imgSrc, isOwner = false }: UserBannerImageProps) => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (isOwner) {
      router.push('/profile/settings');
    }
  };

  return (
    <div className="h-48 sm:h-60 lg:h-70 xl:h-80 bg-theme-gray-100">
      <div className="w-full h-full overflow-hidden">
        {imgSrc ? (
          <BGImage src={imgSrc} />
        ) : (
          <div
            className={`relative w-full h-full flex flex-row items-center justify-center bg-theme-gray-100 ${
              isOwner ? 'hover:bg-theme-gray-200 cursor-pointer' : ''
            }`}
            onClick={handleClick}
          >
            <BGImage src={profileEditBg.src} />
            {isOwner && <FaPen className="absolute" />}
          </div>
        )}
      </div>
    </div>
  );
};
