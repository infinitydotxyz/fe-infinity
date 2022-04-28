import { FunctionComponent, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { Button, ImageUploader } from 'src/components/common';

const FORM_LABEL = 'profile-background-upload';

interface BannerImageProps {
  imgSource?: string;
  className?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export const ProfileBannerImageUpload: FunctionComponent<BannerImageProps> = ({
  onUpload,
  onDelete,
  imgSource = null
}) => {
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
      <label htmlFor={FORM_LABEL} className="flex-1">
        <div className="w-full h-40 rounded-3xl overflow-hidden">
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

      <div className="sm:pl-8 mt-2 sm:mt-0">
        <Button
          variant="primary"
          className="my-1 py-2.5 px-12 mb-2 block w-full sm:w-44 font-button"
          onClick={handleUploadImage}
          disabled={!file || isLoading}
        >
          Upload
        </Button>
        <Button
          variant="outline"
          className="my-1 py-2 px-12 d-block w-full sm:w-44 block font-button"
          disabled={isLoading || !imgSrc}
          onClick={handleImageRemove}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
