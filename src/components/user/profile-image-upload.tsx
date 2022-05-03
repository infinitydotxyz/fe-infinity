import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import AvatarEditor from 'react-avatar-editor';

import { ImageUploader, Button, ImageUploaderButtonRef, Modal } from 'src/components/common';

interface ProfileImageProps {
  imgSource?: string;
  className?: string;
  onUpload: (file: File | Blob) => void;
  onDelete: () => void;
}

const FORM_LABEL = 'profile-image-upload';

export const ProfileImageUpload: FunctionComponent<ProfileImageProps> = ({ onUpload, onDelete, imgSource = null }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(imgSource);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(imgSource);
  const [file, setFile] = useState<File | Blob | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [tempImgScale, setTempImgScale] = useState(1);
  const uploadInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const handleChangeFile = (file: File) => {
    try {
      setIsOpen(true);
      const imageUrl = URL.createObjectURL(file);
      setTempImgSrc(imageUrl);
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

  const handleScale = (e: any) => {
    const scale = parseFloat(e.target.value);
    setTempImgScale(scale);
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        setLoading(true);
        await onUpload(file);
        setLoading(false);
        setFile(null);
      }
    };

    uploadFile().catch(console.error);
  }, [file]);

  return (
    <div className="sm:flex items-center flex-wrap mb-5">
      <label htmlFor={FORM_LABEL}>
        <div className="overflow-hidden bg-theme-light-200 w-28 h-28 mx-auto sm:mx-0 rounded-full">
          {imgSrc ? (
            <img alt="" className="object-cover h-full cursor-pointer" src={imgSrc} />
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
          className="my-1 py-2.5 px-12 mb-3 block w-full sm:w-44 font-zagmamono"
          onClick={onUploadButtonClick}
          disabled={isLoading}
        >
          Upload
        </Button>
        <ImageUploaderButtonRef buttonRef={uploadInput} onChangeFile={handleChangeFile} />
        <Button
          variant="outline"
          className="my-1 py-2 px-12 d-block w-full sm:w-44 block font-zagmamono"
          disabled={isLoading || !imgSrc}
          onClick={handleImageRemove}
        >
          Delete
        </Button>
      </div>
      {/* Image resizing modal */}
      <Modal isOpen={modalIsOpen} onClose={() => setIsOpen(false)} okButton="Save" onOKButton={onClickSave}>
        <AvatarEditor
          ref={editorRef}
          image={tempImgSrc || ''}
          width={250}
          height={250}
          border={50}
          borderRadius={150}
          color={[255, 255, 255, 0.6]}
          scale={tempImgScale}
        />
        <div className="flex flex-row gap-2">
          {/* <span>Zoom:</span> */}
          <label htmlFor="zoomRange" className="form-label">
            Zoom:
          </label>
          <input
            id="zoomRange"
            name="scale"
            type="range"
            onChange={handleScale}
            min="1"
            max="2"
            step="0.01"
            defaultValue="1"
          />
        </div>
      </Modal>
    </div>
  );
};
