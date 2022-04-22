import { FunctionComponent, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { ImageUploader, Button } from 'src/components/common';
import clsx from 'classnames';

interface ProfileImageProps {
  className?: string;
  onUpload: (file: File) => void;
}

const FORM_LABEL = 'profile-image-upload';

export const ProfileImage: FunctionComponent<ProfileImageProps> = ({ className, onUpload }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChangeFile = (file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      setFile(file);
      setImgSrc(imageUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadImage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex items-center flex-wrap ">
      <label htmlFor={FORM_LABEL}>
        <div
          className={clsx('overflow-hidden bg-theme-light-200 w-32 h-32', className)}
          style={{
            border: '3px solid rgb(251, 253, 255)',
            boxShadow: 'rgb(14 14 14 / 60%) 0px 0px 2px 0px',
            borderRadius: '50%'
          }}
        >
          {imgSrc ? (
            <img alt="" className="object-cover" src={imgSrc} />
          ) : (
            <div className="w-full h-full flex flex-row items-center justify-center">
              <FaPen className=" -mt-0.5" />
            </div>
          )}
          <ImageUploader formLabel={FORM_LABEL} onChangeFile={handleChangeFile} />
        </div>
      </label>
      <div className="pl-4">
        <Button variant="primary" className="py-2.5 w-44 px-12 mb-2 block" onClick={handleUploadImage} disabled={!file}>
          Upload
        </Button>
        <Button variant="outline" className="py-2 w-44 px-12 d-block block">
          Delete
        </Button>
      </div>
    </div>
  );
};
