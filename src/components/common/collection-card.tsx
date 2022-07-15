// import { trimText } from './read-more-text';
import { Button } from './button';
import { CollectionSearchDto } from '../../utils/types/collection-types';
import { NextLink } from './next-link';
import { SVG } from './svg';
import { EZImage } from './ez-image';

interface Props {
  collection: CollectionSearchDto;
  buttonName?: string;
  routerQuery?: string;
  onButtonClick?: (collection: CollectionSearchDto) => void;
}

export const CollectionCard = ({ collection, onButtonClick, buttonName, routerQuery }: Props) => {
  // const shortText = trimText(collection.description, 60, 80, 100)[0];
  // const isTrimText = shortText.length !== collection.description.length;

  return (
    <div
      className={`w-full mx-auto sm:mx-0 bg-theme-light-100
      p-2 shadow-[0_20px_20px_1px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_20px_1px_rgba(0,0,0,0.15)]
      rounded-3xl overflow-hidden cursor-pointer`}
    >
      <NextLink
        href={`/collection/${collection.slug}${routerQuery ? `?${routerQuery}` : ''}`}
        className="text-theme-light-800 font-heading tracking-tight mr-2"
      >
        <div style={{ height: '300px' }}>
          <EZImage src={collection.bannerImage} className="rounded-3xl overflow-clip" />
        </div>
        <div className="pt-4">
          <div className="flex items-center font-body text-base font-medium px-5 text-black">
            {collection.name}
            {collection.hasBlueCheck ? <SVG.blueCheck className="w-5 h-5 ml-1" /> : null}
          </div>
          {/* <div className="font-body pt-0.5 text-base px-5 text-theme-light-800">
            {shortText}
            {isTrimText && ' ...'}
          </div> */}
        </div>
      </NextLink>

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
