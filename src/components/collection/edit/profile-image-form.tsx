import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from 'src/components/common';
import { AvatarImage } from '../avatar-image';

export interface ProfileImageFormProps {
  /**
   * The initial profile image source URL.
   */
  url?: string;

  /**
   * The initial profile image alt text.
   */
  alt?: string;

  /**
   * Handler that's called when the profile image should be deleted from the metadata.
   */
  onDelete: () => void;

  /**
   * Handler that's called when a new image should be uploaded and updated.
   */
  onUpload: (file: File) => void;
}

export const ProfileImageForm: React.FC<ProfileImageFormProps> = (props) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState(props.url);

  useEffect(() => setPreviewUrl(props.url), [props.url]);

  const onFileChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(selectedFile);
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile as Blob);
  };

  const onDelete = () => {
    if (file != null) {
      setFile(undefined);
      setPreviewUrl(props.url);
      return;
    }

    props.onDelete();
  };

  return (
    <form className="flex flex-row items-center justify-between md:justify-start">
      <AvatarImage url={previewUrl} alt={props.alt} size="large" />
      <input
        ref={inputFileRef}
        onChange={onFileChanged}
        type="file"
        name="profileImage"
        className="hidden"
        accept="image/*"
      ></input>
      <div className="flex flex-col space-y-2 ml-2">
        <Button onClick={() => (file != null ? props.onUpload(file) : inputFileRef.current?.click())}>
          {file != null ? 'Upload' : 'Select'}
        </Button>
        <Button onClick={onDelete} variant="outline">
          Delete
        </Button>
      </div>
    </form>
  );
};
