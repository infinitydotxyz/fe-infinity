import { FunctionComponent, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { ImageUploader, Button } from 'src/components/common';

interface ProfileImageProps {
  imgSource?: string;
  className?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const FORM_LABEL = 'profile-image-upload';

export const ProfileImageUpload: FunctionComponent<ProfileImageProps> = ({ onUpload, onDelete, imgSource = null }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(imgSource);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleChangeFile = (file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      setFile(file);
      setImgSrc(imageUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageRemove = async () => {
    setLoading(true);
    await onDelete();
    setLoading(false);
    setImgSrc(null);
  };

  const handleUploadImage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (file) {
      setLoading(true);
      await onUpload(file);
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="sm:flex items-center flex-wrap ">
      <label htmlFor={FORM_LABEL}>
        <div
          className="overflow-hidden bg-theme-light-200 w-28 h-28 mx-auto sm:mx-0"
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
      <div className="sm:pl-8 mt-2 sm:mt-0">
        <Button
          variant="primary"
          className="my-1 py-2.5 px-12 mb-2 block w-full sm:w-44"
          onClick={handleUploadImage}
          disabled={!file || isLoading}
        >
          Upload
        </Button>
        <Button
          variant="outline"
          className="my-1 py-2 px-12 d-block w-full sm:w-44 block"
          disabled={isLoading || !imgSrc}
          onClick={handleImageRemove}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
