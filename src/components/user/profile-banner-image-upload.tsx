import { useEffect, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { FaPen } from 'react-icons/fa';

import { BGImage, Button, ImageUploader, ImageUploaderButtonRef, Modal } from 'src/components/common';

const FORM_LABEL = 'profile-background-upload';

interface Props {
  imgSource?: string;
  className?: string;
  onUpload: (file: File | Blob) => void;
  onDelete: () => void;
}

export const ProfileBannerImageUpload = ({ onUpload, onDelete, imgSource }: Props) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(imgSource);
  const [tempImgSrc, setTempImgSrc] = useState<string | undefined>(imgSource);
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
    setImgSrc(undefined);
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
        await onUpload(file);
        setLoading(false);
        setFile(null);
      }
    };

    uploadFile().catch(console.error);
  }, [file]);

  return (
    <div className="sm:flex items-center flex-wrap ">
      <label htmlFor={FORM_LABEL} className="flex-1">
        <div className="w-full h-40 rounded-3xl overflow-hidden">
          {imgSrc ? (
            <BGImage src={imgSrc} />
          ) : (
            <div className="w-full h-full flex flex-row items-center justify-center bg-theme-gray-100 hover:bg-theme-gray-200 cursor-pointer">
              <FaPen />
            </div>
          )}
          <ImageUploader formLabel={FORM_LABEL} onChangeFile={handleChangeFile} />
        </div>
      </label>

      <div className="sm:pl-8 mt-2 sm:mt-0">
        <Button
          variant="primary"
          className="my-1 py-2.5 px-12 mb-2 block w-full sm:w-44 font-heading"
          onClick={onUploadButtonClick}
          disabled={isLoading}
        >
          Upload
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
      {/* Image resizing modal */}
      <Modal isOpen={modalIsOpen} onClose={() => setIsOpen(false)} okButton="Save" onOKButton={onClickSave}>
        <AvatarEditor
          ref={editorRef}
          image={tempImgSrc || ''}
          width={400}
          height={250}
          border={50}
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
