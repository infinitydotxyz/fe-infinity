import { twMerge } from 'tailwind-merge';

const sizes = {
  medium: 'w-28 h-28',
  large: 'w-32 h-32'
};

export interface Props {
  url?: string;
  onClick?: () => void;
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
}

export const AvatarImage = ({ url, onClick, className, alt, size = 'medium' }: Props) => {
  return <img src={url} alt={alt} className={twMerge(sizes[size], className)} onClick={onClick} />;
};
