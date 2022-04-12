import { FunctionComponent } from 'react';
import { trimText } from './read-more-text';
import Link from 'next/link';

import { CollectionSearchDto } from 'pages/explore';

const BLANK_IMAGE_URL = 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png';

interface CollectionCardProps {
  collection: CollectionSearchDto;
}

export const CollectionCard: FunctionComponent<CollectionCardProps> = ({ collection }) => {
  const shortText = trimText(collection.description, 80, 100, 120)[0];

  const isTrimText = shortText.length !== collection.description.length;

  return (
    <article className="w-full max-w-xs mx-auto sm:mx-0 bg-theme-light-100 pb-3 shadow-md rounded-2xl overflow-hidden hover:shadow-xl cursor-pointer">
      <Link href={`/collection/${collection.slug}`}>
        <a href={`/collection/${collection.slug}`} className="text-theme-light-800 font-heading tracking-tight mr-2">
          <img src={collection.profileImage || BLANK_IMAGE_URL} className="w-full" alt="collection image url" />
          <div className="p-4 text-center">
            <h6 className="font-body text-base font-bold">{collection.name}</h6>
            <p className="font-body pt-2 text-sm px-2 text-theme-light-800">
              {shortText}
              {isTrimText && ' ...'}
            </p>
          </div>
        </a>
      </Link>
    </article>
  );
};
