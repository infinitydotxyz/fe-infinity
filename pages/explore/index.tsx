import React, { useState } from 'react';
import { PageBox } from 'src/components/common';
import { FetchMore } from 'src/components/common';
import Link from 'next/link';
import { SearchBox } from 'src/components/filter/search-box';
//import { NextPageContext } from 'next';
//import { apiGet } from 'src/utils';
//import { Collection } from '@infinityxyz/lib/types/core';
//import { GalleryBox } from 'src/components/gallery/gallery-box';

// get image ids here https://picsum.photos/images
const BLANK_IMAGE_URL =
  'https://imageio.forbes.com/specials-images/imageserve/6170e01f8d7639b95a7f2eeb/Sotheby-s-NFT-Natively-Digital-1-2-sale-Bored-Ape-Yacht-Club--8817-by-Yuga-Labs/0x0.png?fit=bounds&format=png&width=960';

const sampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const ExplorePage: React.FC = () => {
  const [res, setRes] = useState<Array<number>>([]);
  const [page, setPage] = useState(0);
  const [data] = useState<Array<number>>(() => [...sampleArray]);

  const handleFetchMore = async () => {
    setRes([...res, ...data]);
    setPage(page + 1);
  };

  return (
    <PageBox title="Explore" hideTitle>
      <SearchBox />

      <h1 className="text-heading text-3xl">Collections</h1>
      <div className="flex justify-between flex-wrap -mx-4">
        {res.map((val, key) => (
          <div key={key} className="w-full sm:w-72 lg:w-80 p-4">
            <Link href={`/asset/1/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/8880`}>
              <a href={`/asset/1/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/8880`}>
                <img className="rounded-3xl" src={BLANK_IMAGE_URL} />
                <p className="mt-3 px-2 font-theme-heading">
                  Psychic Blossom NFT name or a really long name that takes up a lot of space
                </p>
              </a>
            </Link>
          </div>
        ))}
        <FetchMore onFetchMore={handleFetchMore} data={data} currentPage={page} />
      </div>
    </PageBox>
  );
};

export default ExplorePage;
