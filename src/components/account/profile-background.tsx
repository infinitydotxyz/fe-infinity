import { FunctionComponent, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { ImageUploader } from '../common';

const FORM_LABEL = 'profile-background-upload';

export const ProfileBackground: FunctionComponent = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleChangeFile = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImgSrc(imageUrl);
  };

  return (
    <label htmlFor={FORM_LABEL}>
      <div className="w-full h-full overflow-hidden">
        {imgSrc ? (
          <img className="w-full object-cover" src={imgSrc} />
        ) : (
          <div className="w-full h-full flex flex-row items-center justify-center bg-theme-light-200">
            <FaPen />
          </div>
        )}
        <ImageUploader formLabel={FORM_LABEL} onChangeFile={handleChangeFile} />
      </div>
    </label>
  );
};
