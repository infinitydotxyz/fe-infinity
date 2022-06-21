import React, { RefObject } from 'react';

interface ImageUploaderProps {
  buttonRef: RefObject<HTMLInputElement>;
  onChangeFile: (file: File) => void;
}

export const ImageUploaderButtonRef: React.FC<ImageUploaderProps> = ({ buttonRef, onChangeFile }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      onChangeFile(e.currentTarget.files[0]);
    }
  };

  return (
    <input
      type="file"
      ref={buttonRef}
      onChange={handleImageChange}
      hidden
      id="profile-image-upload-button"
      accept="image/*"
    />
  );
};
