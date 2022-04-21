import React from 'react';

interface ImageUploaderProps {
  formLabel: string;
  onChangeFile: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ formLabel, onChangeFile }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      onChangeFile(e.currentTarget.files[0]);
    }
  };

  return <input type="file" onChange={handleImageChange} hidden id={formLabel} />;
};
