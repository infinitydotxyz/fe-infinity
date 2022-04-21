import { FunctionComponent, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import clsx from 'classnames';
import { ImageUploader, Button } from 'src/components/common';

interface ProfileImageProps {
  className?: string;
}

const FORM_LABEL = 'profile-image-upload';

export const ProfileImage: FunctionComponent<ProfileImageProps> = ({ className }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleChangeFile = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImgSrc(imageUrl);
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
        <div>
          <Button variant="primary" className="py-2.5 w-44 px-12 mb-2 d-block">
            Upload
          </Button>
        </div>
        <div>
          <Button variant="outline" className="py-2 w-44 px-12 d-block">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
