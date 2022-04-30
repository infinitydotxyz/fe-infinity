import React from 'react';
import { SVG } from 'src/components/common';

export interface RemoveIconProps {
  onClick?: () => void;
}

export const RemoveIcon: React.FC<RemoveIconProps> = ({ onClick }) => {
  return <SVG.remove width={20} height={20} className="cursor-pointer" onClick={onClick} />;
};
