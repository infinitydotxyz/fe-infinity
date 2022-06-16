import { trimText } from './read-more-text';
import { BLANK_IMAGE_URL } from 'src/utils';
import { Button } from './button';
import { CollectionSearchDto } from '../../utils/types/collection-types';

interface CollectionCardProps {
  collection: CollectionSearchDto;
  buttonName?: string;
  routerQuery?: string;
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

export const CollectionCard = ({ collection, onButtonClick, buttonName, routerQuery }: CollectionCardProps) => {
  const shortText = trimText(collection.description, 60, 80, 100)[0];
  const isTrimText = shortText.length !== collection.description.length;

  const avatarUrl = getAvatarUrl(collection.bannerImage) || BLANK_IMAGE_URL;

  return (
    <div
      className={`w-full mx-auto sm:mx-0 bg-theme-light-100
      p-2 shadow-[0_10px_10px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_10px_4px_rgba(0,0,0,0.2)]
      rounded-3xl overflow-hidden cursor-pointer`}
    >
      <a
        href={`/collection/${collection.slug}${routerQuery ? `?${routerQuery}` : ''}`}
        className="text-theme-light-800 font-heading tracking-tight mr-2"
      >
        <div style={{ height: '200px' }}>
          <img
            src={avatarUrl}
            className="w-full rounded-3xl"
            alt="collection image url"
            style={{ objectFit: 'cover', transition: 'opacity 400ms ease 0s', height: '100%' }}
          />
        </div>
        <div className="pt-4">
          <div className="font-body text-base font-medium px-5 text-black">{collection.name}</div>
          <div className="font-body pt-0.5 text-base px-5 text-theme-light-800">
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
