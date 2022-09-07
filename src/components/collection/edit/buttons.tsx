import { AiOutlinePlus } from 'react-icons/ai';
import { Button, ButtonProps } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

export const PlusButton: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <Button
    {...props}
    className={twMerge(
      'w-full border rounded-3xl border-gray-100 bg-theme-gray-100 hover:bg-theme-gray-200 text-black font-heading',
      className
    )}
  >
    <span className="flex flex-row items-center justify-center">
      <span className="hidden md:inline">{children}</span>
      <AiOutlinePlus className="ml-1 text-lg font-bold" />
    </span>
  </Button>
);
