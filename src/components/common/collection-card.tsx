import { trimText } from './read-more-text';
import { BLANK_IMAGE_URL } from 'src/utils';
import { CollectionSearchDto } from './collection-grid';
import { Button } from './button';

interface CollectionCardProps {
  collection: CollectionSearchDto;
  buttonName?: string;
  onButtonClick?: (collection: CollectionSearchDto) => void;
}

const getAvatarUrl = (imgUrl: string) => {
  if (!imgUrl) {
    return null;
  } else {
    const index = imgUrl.indexOf('=');
    if (index) {
      return imgUrl.slice(0, index) + '=h200';
    }
    return imgUrl;
  }
};

export const CollectionCard = ({ collection, onButtonClick, buttonName }: CollectionCardProps) => {
  const shortText = trimText(collection.description, 60, 80, 100)[0];
  const isTrimText = shortText.length !== collection.description.length;

  const avatarUrl = getAvatarUrl(collection.bannerImage) || BLANK_IMAGE_URL;

  return (
    <div className="w-full mx-auto sm:mx-0 bg-theme-light-100 border border-theme-light-100 shadow-md rounded-2xl overflow-hidden hover:shadow-xl cursor-pointer">
      <a href={`/collection/${collection.slug}`} className="text-theme-light-800 font-heading tracking-tight mr-2">
        <div style={{ height: '200px' }}>
          <img
            src={avatarUrl}
            className="w-full"
            alt="collection image url"
            style={{ objectFit: 'cover', transition: 'opacity 400ms ease 0s', height: '100%' }}
          />
        </div>
        <div className="pt-4  text-center">
          <div className="font-body text-base font-bold text-black">{collection.name}</div>
          <div
            className="font-body pt-2 text-base px-5 text-theme-light-800"
            // Steve: debugging (will remove when done)
            // onClick={(e) => {
            //   e.preventDefault();
            //   e.stopPropagation();

            //   console.log(JSON.stringify(collection, null, '  '));
            // }}
          >
            {shortText}
            {isTrimText && ' ...'}
          </div>
        </div>
      </a>

      {onButtonClick && (
        <div className="flex justify-center w-full mb-4">
          <Button variant="outline" onClick={() => onButtonClick(collection)}>
            {buttonName ?? '???'}
          </Button>
        </div>
      )}
    </div>
  );
};
