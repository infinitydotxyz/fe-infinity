import React, { useState } from 'react';
import { Card, PageBox } from 'src/components/common';
import { FetchMore } from 'src/components/common';
// import Link from 'next/link';
import { SearchBox } from 'src/components/filter/search-box';
//import { NextPageContext } from 'next';
//import { apiGet } from 'src/utils';
//import { Collection } from '@infinityxyz/lib/types/core';
//import { GalleryBox } from 'src/components/gallery/gallery-box';

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
        {/* {res.map((val, key) => (
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
        ))} */}
        {res.map((val, key) => {
          const dt = {
            id: 'nft1',
            title: 'NFT 1',
            tokenId: 'Token1',
            price: 1.5,
            image:
              'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
          };
          return (
            <React.Fragment key={key}>
              <Card data={dt} onClick={console.log} className="mt-8 ml-8" />
            </React.Fragment>
          );
        })}
        <FetchMore onFetchMore={handleFetchMore} data={data} currentPage={page} />
      </div>
    </PageBox>
  );
};

export default ExplorePage;
