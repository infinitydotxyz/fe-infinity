import { FunctionComponent } from 'react';
import { FaPen } from 'react-icons/fa';

export const ProfileBackground: FunctionComponent = () => {
  return (
    <>
      <img className="w-full object-cover" />
      <div className="w-full h-full flex flex-row items-center justify-center bg-theme-light-200">
        <FaPen />
      </div>
    </>
  );
};
