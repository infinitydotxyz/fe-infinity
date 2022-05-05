import { twMerge } from 'tailwind-merge';

interface Props {
  url?: string;
  center?: boolean; // false for bg-top
  className?: string;
}

export const BGImage = ({ url, center = true, className = '' }: Props) => {
  if (!url) {
    return <></>;
  }

  return (
    <div
      className={twMerge(center ? 'bg-center' : 'bg-top', 'w-full h-full bg-cover bg-no-repeat', className)}
      style={{ backgroundImage: `url(${url})` }}
    />
  );
};
