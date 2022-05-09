import { FaPen } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { BGImage } from '../common';

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
    <div className="h-48 lg:h-64 xl:h-72 overflow-hidden bg-theme-light-200">
      <div className="w-full h-full overflow-hidden">
        {imgSrc ? (
          <BGImage src={imgSrc} />
        ) : (
          <div
            className="w-full h-full flex flex-row items-center justify-center bg-theme-light-200 cursor-pointer"
            onClick={handleClick}
          >
            {isOwner && <FaPen />}
          </div>
        )}
      </div>
    </div>
  );
};
