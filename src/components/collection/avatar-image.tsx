import { twMerge } from 'tailwind-merge';

const sizes = {
  medium: 'w-28 h-28',
  large: 'w-30 h-30'
};

export interface Props {
  url?: string;
  onClick?: () => void;
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
}

export function AvatarImage({ url, onClick, className, alt, size = 'medium' }: Props) {
  return <img src={url} alt={alt} className={twMerge(sizes[size], className)} onClick={onClick} />;
}
