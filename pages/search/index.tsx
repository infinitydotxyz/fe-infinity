import NotFound404Page from 'pages/not-found-404';
import React from 'react';

// const SearchPage = () => {
//   const { search, setType, setQuery, setSubType, setSubTypeQuery } = useSearchState();
//   const { result, isLoading } = useSearch(search);

//   return (
//     <PageBox title="Search">
//       <TextInputBox
//         label="Query"
//         value={search.query}
//         type="text"
//         onChange={(q) => setQuery(q)}
//         placeholder="0xed5af388653567af2f388e6224dc7c4b3241c544"
//         isFullWidth
//       />

//       {'subType' in search && (
//         <TextInputBox
//           label="Sub Query"
//           value={search.subTypeQuery}
//           type="text"
//           onChange={(q) => setSubTypeQuery(q)}
//           placeholder="200"
//         />
//       )}

//       <Checkbox
//         boxOnLeft={true}
//         checked={search.type === SearchType.Collection}
//         onChange={() => setType(SearchType.Collection)}
//         label={'Collections'}
//       />

//       <Checkbox
//         boxOnLeft={true}
//         checked={search.type === SearchType.User}
//         onChange={() => setType(SearchType.User)}
//         label={'Users'}
//       />

//       {search.type === SearchType.Collection && (
//         <Checkbox
//           boxOnLeft={true}
//           checked={'subType' in search && search.subType === CollectionSearchType.Nft}
//           onChange={() => ('subType' in search ? setSubType() : setSubType(CollectionSearchType.Nft))}
//           label={'Collection Nfts'}
//         />
//       )}

//       {isLoading && <Spinner />}

//       {result && result.data.length > 0 && (
//         <div className="mt-4">
//           {result.data.map((item) => {
//             if ('address' in item) {
//               return <Collection collection={item} key={item.address} />;
//             } else {
//               return <Nft nft={item} key={`${item.collectionDisplayData?.address}:${item.tokenId}`} />;
//             }
//           })}
//         </div>
//       )}
//     </PageBox>
//   );
// };

// const Collection = ({ collection }: { collection: CollectionDisplayData }) => {
//   return (
//     <div className="flex mt-2 justify-left align-center">
//       <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={collection.profileImage} />
//       <div className="flex justify-center align-center h-16 mt-6 w-8">{collection.hasBlueCheck && <BlueCheck />}</div>
//       <div className="flex justify-center align-center h-16 mt-5">{collection.slug}</div>
//     </div>
//   );
// };

// const Nft = ({ nft }: { nft: NftDisplayData }) => {
//   return (
//     <div className="flex mt-2 justify-left align-center">
//       <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={nft.image} />
//       <div className="h-16 mt-2 ml-4">
//         <div className="flex align-center">
//           {nft.collectionDisplayData.name}
//           <div className="flex justify-center align-center mt-1 ml-2">
//             {nft.collectionDisplayData.hasBlueCheck && <BlueCheck />}
//           </div>
//         </div>
//         <div className="flex align-center">{nft.tokenId}</div>
//       </div>
//     </div>
//   );
// };

export default () => {
  return <NotFound404Page />;
};
