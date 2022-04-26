import { FunctionComponent } from 'react';
import { FaPen } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface UserBannerImageProps {
  imgSrc?: string;
  isOwner?: boolean;
}

export const UserBannerImage: FunctionComponent<UserBannerImageProps> = ({ imgSrc, isOwner = false }) => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (isOwner) router.push('/profile/settings');
  };

  return (
    <div className="h-48 lg:h-64 xl:h-72 overflow-hidden bg-theme-light-200">
      <div className="w-full h-full overflow-hidden">
        {imgSrc ? (
          <img className="w-full object-cover" src={imgSrc} />
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
