import { BaseCollection, CollectionMetadata } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { AvatarImage } from 'src/components/collection/avatar-image';
import SocialsInputGroup from 'src/components/collection/socials-input-group';
import { Button, TextAreaInputBox, TextInputBox } from 'src/components/common';
import { Heading } from 'src/components/common/heading';
import logo from 'src/images/logo-mini-new.svg';
import { useFetch } from 'src/utils';
import { DeepPartial } from 'src/utils/typeUtils';

const spaces = {
  article: 'space-y-5'
};

function reducer(
  state: DeepPartial<CollectionMetadata>,
  action: { type: 'update' | 'updateLink' | 'addPartnership' | 'addBenefit'; metadata: DeepPartial<CollectionMetadata> }
): DeepPartial<CollectionMetadata> {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.metadata };
    case 'updateLink':
      return { ...state, links: { ...state.links, ...action.metadata.links } };
    case 'addBenefit':
      return { ...state, benefits: [...(state.benefits ?? []), ...(action.metadata.benefits ?? [])] };
    case 'addPartnership':
      return { ...state, partnerships: [...(state.partnerships ?? []), ...(action.metadata.partnerships ?? [])] };
    default:
      throw new Error();
  }
}

export default function EditCollectionPage() {
  const router = useRouter();
  const { result: collection } = useFetch<BaseCollection>(
    router.query.name ? `/collections/${router.query.name}` : '',
    { chainId: '1' }
  );
  const [metadata, dispatchMetadata] = useReducer(reducer, {});

  useEffect(() => dispatchMetadata({ type: 'update', metadata: collection?.metadata ?? {} }), [collection]);

  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto">
      <header className="flex justify-between p-5">
        <img alt="logo" src={logo.src} width={logo.width} />
        <nav className="flex flex-row space-x-2">
          <Button variant="outline" onClick={router.back}>
            Cancel
          </Button>
          <Button>Save</Button>
        </nav>
      </header>
      <main className="flex flex-col my-4 mx-auto w-144 space-y-5">
        <article className="flex flex-row items-center">
          <AvatarImage url={metadata.profileImage} size="large" />
          <div className="flex flex-col space-y-2 ml-2">
            <Button>Upload</Button>
            <Button variant="outline">Delete</Button>
          </div>
        </article>

        <article className={spaces.article}>
          <Heading as="h3">Edit collection</Heading>
          <TextInputBox
            label="Collection name"
            value={metadata?.name || ''}
            type="text"
            onChange={(name) => dispatchMetadata({ type: 'update', metadata: { name } })}
            placeholder="Vortex"
            isFullWidth
          />
          <TextAreaInputBox
            label="Description"
            value={metadata?.description || ''}
            onChange={(description) => dispatchMetadata({ type: 'update', metadata: { description } })}
            placeholder=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum."
            rows={7}
          />
        </article>

        <article className={spaces.article}>
          <Heading as="h3">Socials</Heading>
          <SocialsInputGroup>
            <TextInputBox
              label="Twitter"
              value={metadata.links?.twitter || ''}
              type="text"
              onChange={(twitter) => dispatchMetadata({ type: 'updateLink', metadata: { links: { twitter } } })}
              placeholder="https://twitter.com/user"
              isFullWidth
            />
            <TextInputBox
              label="Instagram"
              value={metadata.links?.instagram || ''}
              type="text"
              onChange={(instagram) => dispatchMetadata({ type: 'updateLink', metadata: { links: { instagram } } })}
              placeholder="https://instagram.com/user"
              isFullWidth
            />
          </SocialsInputGroup>
          <SocialsInputGroup>
            <TextInputBox
              label="Facebook"
              value={metadata.links?.facebook || ''}
              type="text"
              onChange={(facebook) => dispatchMetadata({ type: 'updateLink', metadata: { links: { facebook } } })}
              placeholder="https://facebook.com/page"
              isFullWidth
            />
            <TextInputBox
              label="Discord"
              value={metadata.links?.discord || ''}
              type="text"
              onChange={(discord) => dispatchMetadata({ type: 'updateLink', metadata: { links: { discord } } })}
              placeholder="https://discord.com/invite"
              isFullWidth
            />
          </SocialsInputGroup>
          <SocialsInputGroup>
            <TextInputBox
              label="Medium"
              value={metadata.links?.medium || ''}
              type="text"
              onChange={(medium) => dispatchMetadata({ type: 'updateLink', metadata: { links: { medium } } })}
              placeholder="https://medium.com/user"
              isFullWidth
            />
            <TextInputBox
              label="Telegram"
              value={metadata.links?.telegram || ''}
              type="text"
              onChange={(telegram) => dispatchMetadata({ type: 'updateLink', metadata: { links: { telegram } } })}
              placeholder="https://t.me/invite"
              isFullWidth
            />
          </SocialsInputGroup>
          <SocialsInputGroup>
            <TextInputBox
              label="External"
              value={metadata.links?.external || ''}
              type="text"
              onChange={(external) => dispatchMetadata({ type: 'updateLink', metadata: { links: { external } } })}
              placeholder="https://example.com"
              isFullWidth
            />
            <TextInputBox
              label="Wiki"
              value={metadata.links?.wiki || ''}
              type="text"
              onChange={(wiki) => dispatchMetadata({ type: 'updateLink', metadata: { links: { wiki } } })}
              placeholder="https://example.com/wiki"
              isFullWidth
            />
          </SocialsInputGroup>
        </article>

        <article className={spaces.article}>
          <Heading as="h3">Benefits</Heading>
          <TextInputBox
            label="Benefit 1"
            value=""
            type="text"
            onChange={console.log}
            placeholder="1st benefit"
            isFullWidth
          />
          <Button variant="gray" className="w-full">
            Add benefit
          </Button>
        </article>

        <article className={spaces.article}>
          <Heading as="h3">Partnerships</Heading>
          <SocialsInputGroup>
            <TextInputBox
              label="Partner name"
              value=""
              type="text"
              onChange={console.log}
              placeholder="Name"
              isFullWidth
            />
            <TextInputBox
              label="Partnership website"
              value=""
              type="text"
              onChange={console.log}
              placeholder="Website URL"
              isFullWidth
            />
          </SocialsInputGroup>
          <Button variant="gray" className="w-full">
            Add partnership
          </Button>
        </article>
      </main>

      <footer className="p-5"></footer>
    </div>
  );
}
