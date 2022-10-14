// import { TextInput } from 'flowbite-react';
// import { useRouter } from 'next/router';
import React from 'react';
import { BlueCheck, Checkbox, EZImage, PageBox, Spinner, TextInputBox } from 'src/components/common';
import { SearchType, useSearch, useSearchState } from 'src/hooks/api/useSearch';

const SearchPage = () => {
  const { search, setType, setQuery } = useSearchState();

  const { result, isLoading } = useSearch(search);

  return (
    <PageBox title="Search">
      <TextInputBox
        label="Query"
        value={search.query}
        type="text"
        onChange={(q) => setQuery(q)}
        placeholder="0xed5af388653567af2f388e6224dc7c4b3241c544"
        isFullWidth
      />

      <Checkbox
        boxOnLeft={true}
        // className="w-full"
        checked={search.type === SearchType.Collection}
        onChange={() => setType(SearchType.Collection)}
        label={'Collections'}
      />

      <Checkbox
        boxOnLeft={true}
        // className="w-full"
        checked={search.type === SearchType.User}
        onChange={() => setType(SearchType.User)}
        label={'Users'}
      />

      <Checkbox
        boxOnLeft={true}
        // className="w-full"
        checked={search.type === SearchType.User}
        onChange={() => setType(SearchType.User)}
        label={'Users'}
      />

      {isLoading && <Spinner />}

      {result && result.data.length > 0 && (
        <div className="mt-4">
          {result.data.map((collection) => (
            <div key={collection.address} className="flex mt-2 justify-left align-center">
              <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={collection.metadata?.profileImage} />
              <div className="flex justify-center align-center h-16 mt-6 w-8">
                {collection.hasBlueCheck && <BlueCheck />}
              </div>
              <div className="flex justify-center align-center h-16 mt-5">{collection.slug}</div>
            </div>
          ))}
        </div>
      )}
    </PageBox>
  );
};

export default SearchPage;
