import React from 'react';
import Image from 'next/image';
import RemoveSvg from 'src/images/remove.svg';

export interface RemoveIconProps {
  onClick?: () => void;
}

export const RemoveIcon: React.FC<RemoveIconProps> = ({ onClick }) => {
  return (
    <Image
      width={20}
      height={20}
      src={RemoveSvg.src}
      alt={'Remove item'}
      className="cursor-pointer"
      onClick={onClick}
    />
  );
};
