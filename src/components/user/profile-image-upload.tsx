import { useEffect, useRef, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import AvatarEditor from 'react-avatar-editor';
import { ImageUploader, Button, ImageUploaderButtonRef, Modal, EZImage } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

interface Props {
  imgSource?: string | null;
  roundPhoto: boolean;
  onUpload: (file: File | Blob) => void;
  onDelete: () => void;
}

export const ProfileImageUpload = ({ onUpload, roundPhoto, onDelete, imgSource = null }: Props) => {
  const [imgSrc, setImgSrc] = useState<string | null>(imgSource);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(imgSource);
  const [file, setFile] = useState<File | Blob | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [tempImgScale, setTempImgScale] = useState(1);
  const uploadInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const FORM_LABEL = roundPhoto ? 'round-image-upload' : 'profile-image-upload';

  const handleChangeFile = (file: File) => {
    if (file) {
      try {
        setIsOpen(true);
        const imageUrl = URL.createObjectURL(file);
        setTempImgSrc(imageUrl);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImageRemove = async () => {
    setLoading(true);
    onDelete();
    setLoading(false);
    setImgSrc(null);
  };

  const onUploadButtonClick = () => {
    uploadInput?.current?.click();
  };

  const onClickSave = () => {
    if (editorRef) {
      editorRef?.current?.getImage().toBlob((blob: Blob | null) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setFile(blob);
          setImgSrc(imageUrl);
        }
      });
    }

    setIsOpen(false);
  };

  const handleScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setTempImgScale(scale);
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        setLoading(true);
        onUpload(file);
        setLoading(false);
        setFile(null);
      }
    };

    uploadFile().catch(console.error);
  }, [file]);

  let avatarWidth = 400;
  const avatarHeight = 250;
  const avatarBorder = 50;
  let avatarBorderRadius = 0;

  if (roundPhoto) {
    avatarWidth = 250;
    avatarBorderRadius = 150;
  }

  return (
    <div className="sm:flex items-center flex-wrap mb-5">
      <label htmlFor={FORM_LABEL} className={roundPhoto ? '' : 'flex-1'}>
        <div
          className={twMerge(
            'overflow-hidden bg-theme-gray-100 hover:bg-theme-gray-200 mx-auto sm:mx-0',
            roundPhoto ? 'w-28 h-28 rounded-full' : 'rounded-3xl w-full h-40'
          )}
        >
          {imgSrc ? (
            <EZImage className="cursor-pointer" src={imgSrc} />
          ) : (
            <div className="w-full h-full flex flex-row items-center justify-center cursor-pointer">
              <FaPen className=" -mt-0.5" />
            </div>
          )}
          <ImageUploader formLabel={FORM_LABEL} onChangeFile={handleChangeFile} />
        </div>
      </label>
      <div className="sm:pl-8 mt-2 sm:mt-0">
        <Button
          variant="primary"
          className="my-1 py-2.5 px-12 mb-3 block w-full sm:w-44 font-heading"
          onClick={onUploadButtonClick}
          disabled={isLoading}
        >
          Select
        </Button>
        <ImageUploaderButtonRef buttonRef={uploadInput} onChangeFile={handleChangeFile} />
        <Button
          variant="outline"
          className="my-1 py-2 px-12 d-block w-full sm:w-44 block font-heading"
          disabled={isLoading || !imgSrc}
          onClick={handleImageRemove}
        >
          Delete
        </Button>
      </div>

      <Modal isOpen={modalIsOpen} onClose={() => setIsOpen(false)} okButton="Save" wide={true} onOKButton={onClickSave}>
        <AvatarEditor
          ref={editorRef}
          image={tempImgSrc || ''}
          width={avatarWidth}
          height={avatarHeight}
          border={avatarBorder}
          borderRadius={avatarBorderRadius}
          color={[235, 235, 245, 0.7]}
          scale={tempImgScale}
          className="mx-auto"
        />

        <div className="flex flex-row gap-4 items-center mt-4 focus:outline-none focus-visible:ring">
          <div>Zoom:</div>
          <input
            id="zoomRange"
            name="scale"
            type="range"
            onChange={handleScale}
            min="1"
            max="2"
            step="0.01"
            value={tempImgScale}
          />
        </div>
      </Modal>
    </div>
  );
};
