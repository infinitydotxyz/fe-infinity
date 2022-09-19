import { ReactNode, useState } from 'react';
import { Button } from '../common';
import { FullScreenModal } from '../common/full-screen-modal';

interface Props {
  children: ReactNode;
}

export const ExpandingBox = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="relative h-full overflow-clip w-full max-h-96  " onClick={() => setOpen(true)}>
        {children}

        <div className="absolute  bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-[#FFFFFF00] to-[#FFFFFFFF]" />
      </div>
      <div className=" mt-2 text-center ">Read more</div>

      <FullScreenModal isOpen={open} onClose={() => setOpen(false)}>
        {children}
      </FullScreenModal>
    </div>
  );
};
