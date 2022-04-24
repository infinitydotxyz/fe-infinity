import { BaseCollection, CollectionMetadata } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import { PlusButton } from 'src/components/collection/edit/buttons';
import { ProfileImageForm } from 'src/components/collection/edit/profile-image-form';
import SocialsInputGroup from 'src/components/collection/socials-input-group';
import { Button, TextAreaInputBox, TextInputBox } from 'src/components/common';
import { Heading } from 'src/components/common/heading';
import { Toaster, toastError, toastSuccess } from 'src/components/common/toaster';
import logo from 'src/images/logo-mini-new.svg';
import { apiPut, DISCORD_BOT_INVITE_URL, useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { DeepPartial } from 'src/utils/typeUtils';
import { useSWRConfig } from 'swr';

const spaces = {
  article: 'space-y-3 md:space-y-5'
};

type MetadataAction = 'updateMetadata';
type LinkAction = 'updateLinks';
type PartnershipAction = 'createPartnership' | 'updatePartnership' | 'deletePartnership';
type BenefitAction = 'createBenefit' | 'updateBenefit' | 'deleteBenefit';
type Action = MetadataAction | LinkAction | PartnershipAction | BenefitAction;

function reducer(
  state: DeepPartial<CollectionMetadata>,
  action: {
    type: Action;
    metadata: DeepPartial<CollectionMetadata>;
    key?: string | number;
  }
): DeepPartial<CollectionMetadata> {
  switch (action.type) {
    case 'updateMetadata':
      return { ...state, ...action.metadata };
    case 'updateLinks':
      return { ...state, links: { ...state.links, ...action.metadata.links } };
    case 'createBenefit':
      return { ...state, benefits: [...(state.benefits ?? []), ...(action.metadata.benefits ?? [])] };
    case 'updateBenefit':
      // eslint-disable-next-line no-case-declarations
      const benefitUpdate = (action.metadata.benefits ?? [])[0];

      if (typeof action.key == 'number') {
        const benefits = state.benefits?.map((benefit, i) => (i === action.key ? benefitUpdate : benefit));
        return { ...state, benefits };
      } else {
        throw new Error(`key '${action.key}' must be an index!`);
      }
    case 'createPartnership':
      return { ...state, partnerships: [...(state.partnerships ?? []), ...(action.metadata.partnerships ?? [])] };
    case 'updatePartnership':
      // eslint-disable-next-line no-case-declarations
      const partnershipUpdate = (action.metadata.partnerships ?? [])[0];

      if (typeof action.key == 'number') {
        const partnerships = state.partnerships?.map((partnership, i) =>
          i === action.key ? { ...partnership, ...partnershipUpdate } : partnership
        );

        return { ...state, partnerships };
      } else {
        throw new Error(`key '${action.key}' must be an index!`);
      }
    default:
      throw new Error(`Unknown action type '${action.type}'!`);
  }
}

export default function EditCollectionPage() {
  const router = useRouter();
  const [metadata, dispatchMetadata] = useReducer(reducer, {});
  const [address, setAddress] = useState<string>();
  const { user, chainId, checkSignedIn } = useAppContext();
  const path = router.query.name ? `/collections/${router.query.name}` : '';
  // TODO: maybe we can fetch this data on the server side too?
  const { result: collection } = useFetch<BaseCollection>(path, { chainId });
  const { mutate } = useSWRConfig();

  useEffect(() => {
    dispatchMetadata({ type: 'updateMetadata', metadata: collection?.metadata ?? {} });
    setAddress(collection?.address);
  }, [collection]);

  const close = () => router.replace(`/collection/${router.query.name}`);

  const submit = async () => {
    // console.log(metadata);

    if (!checkSignedIn()) {
      return;
    }

    const { error } = await apiPut(`/user/${chainId}:${user?.address}/collections/${router.query.name}`, {
      data: { metadata, address }
    });

    if (error) {
      console.error(error);
      toastError(error?.errorResponse?.message);
      return;
    }

    toastSuccess('Collection metadata saved');
    close();
  };

  const deleteProfileImage = async () => {
    if (!checkSignedIn()) {
      return;
    }

    const { error } = await apiPut(`/user/${chainId}:${user?.address}/collections/${router.query.name}`, {
      data: { deleteProfileImage: true }
    });

    if (error) {
      console.error(error);
      toastError(error?.errorResponse?.message);
      return;
    }

    toastSuccess('Successfully removed collection profile image');
    mutate(path, (metadata: CollectionMetadata) => ({ ...metadata, profileImage: '' } as CollectionMetadata));
  };

  const uploadProfileImage = async (file: File) => {
    if (!checkSignedIn()) {
      return;
    }

    const fd = new FormData();
    fd.append('profileImage', file);

    const { error } = await apiPut(`/user/${chainId}:${user?.address}/collections/${router.query.name}`, {
      data: fd
    });

    if (error) {
      console.error(error);
      toastError(error?.errorResponse?.message);
      return;
    }

    toastSuccess('Successfully updated collection profile image');
    mutate(path);
  };

  // TODO: add nextjs progressbar
  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto p-4 md:p-0">
      <header className="flex justify-between p-5">
        <img alt="logo" src={logo.src} width={logo.width} />
        <nav className="flex flex-row space-x-2">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit}>Save</Button>
        </nav>
      </header>
      <main className="flex flex-col my-4 mx-auto max-w-xl space-y-5">
        <article>
          <ProfileImageForm
            url={metadata.profileImage}
            alt={metadata.name}
            onDelete={deleteProfileImage}
            onUpload={uploadProfileImage}
          />
        </article>

        <article className={spaces.article}>
          <Heading as="h3" className="font-bold">
            Edit collection
          </Heading>
          <TextInputBox
            label="Collection name"
            value={metadata?.name || ''}
            type="text"
            onChange={(name) => dispatchMetadata({ type: 'updateMetadata', metadata: { name } })}
            placeholder="Vortex"
            isFullWidth
          />
          <TextInputBox
            label="Address"
            value={address || ''}
            type="text"
            onChange={setAddress}
            placeholder="0x13f131717A2a435E372864bFC09061a4513E61A8"
            isFullWidth
          />
          <TextAreaInputBox
            label="Description"
            value={metadata?.description || ''}
            onChange={(description) => dispatchMetadata({ type: 'updateMetadata', metadata: { description } })}
            placeholder=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum."
            rows={7}
          />
        </article>

        <article className={spaces.article}>
          <Heading as="h3" className="font-bold">
            Socials
          </Heading>
          <SocialsInputGroup>
            <TextInputBox
              label="Twitter"
              value={metadata.links?.twitter || ''}
              type="text"
              onChange={(twitter) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { twitter } } })}
              placeholder="https://twitter.com/user"
              isFullWidth
            />
            <TextInputBox
              label="Instagram"
              value={metadata.links?.instagram || ''}
              type="text"
              onChange={(instagram) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { instagram } } })}
              placeholder="https://instagram.com/user"
              isFullWidth
            />
          </SocialsInputGroup>
          <SocialsInputGroup>
            <TextInputBox
              label="Facebook"
              value={metadata.links?.facebook || ''}
              type="text"
              onChange={(facebook) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { facebook } } })}
              placeholder="https://facebook.com/page"
              isFullWidth
            />
            <TextInputBox
              label="Discord"
              value={metadata.links?.discord || ''}
              type="text"
              onChange={(discord) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { discord } } })}
              placeholder="https://discord.com/invite"
              isFullWidth
            />
          </SocialsInputGroup>
          <SocialsInputGroup>
            <TextInputBox
              label="Medium"
              value={metadata.links?.medium || ''}
              type="text"
              onChange={(medium) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { medium } } })}
              placeholder="https://medium.com/user"
              isFullWidth
            />
            <TextInputBox
              label="Telegram"
              value={metadata.links?.telegram || ''}
              type="text"
              onChange={(telegram) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { telegram } } })}
              placeholder="https://t.me/invite"
              isFullWidth
            />
          </SocialsInputGroup>
          <SocialsInputGroup>
            <TextInputBox
              label="External"
              value={metadata.links?.external || ''}
              type="text"
              onChange={(external) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { external } } })}
              placeholder="https://example.com"
              isFullWidth
            />
            <TextInputBox
              label="Wiki"
              value={metadata.links?.wiki || ''}
              type="text"
              onChange={(wiki) => dispatchMetadata({ type: 'updateLinks', metadata: { links: { wiki } } })}
              placeholder="https://example.com/wiki"
              isFullWidth
            />
          </SocialsInputGroup>
        </article>

        <article className={spaces.article}>
          <Heading as="h3" className="font-bold">
            Benefits
          </Heading>
          {metadata.benefits?.map((benefit, i) => (
            <TextInputBox
              key={i}
              label={`Benefit ${i + 1}`}
              value={benefit || ''}
              type="text"
              onChange={(benefit) =>
                dispatchMetadata({ type: 'updateBenefit', metadata: { benefits: [benefit] }, key: i })
              }
              placeholder={`benefit ${i + 1}`}
              isFullWidth
            />
          ))}
          <PlusButton onClick={() => dispatchMetadata({ type: 'createBenefit', metadata: { benefits: [''] } })}>
            Add benefit
          </PlusButton>
        </article>

        <article className={spaces.article}>
          <Heading as="h3" className="font-bold">
            Partnerships
          </Heading>
          {metadata.partnerships?.map((partnership, i) => (
            <SocialsInputGroup key={i}>
              <TextInputBox
                label="Partner name"
                value={partnership?.name || ''}
                type="text"
                onChange={(name) =>
                  dispatchMetadata({ type: 'updatePartnership', metadata: { partnerships: [{ name }] }, key: i })
                }
                placeholder="Name"
                isFullWidth
              />
              <TextInputBox
                label="Partnership website"
                value={partnership?.link || ''}
                type="text"
                onChange={(link) =>
                  dispatchMetadata({ type: 'updatePartnership', metadata: { partnerships: [{ link }] }, key: i })
                }
                placeholder="Website link"
                isFullWidth
              />
            </SocialsInputGroup>
          ))}
          <PlusButton
            onClick={() =>
              dispatchMetadata({ type: 'createPartnership', metadata: { partnerships: [{ link: '', name: '' }] } })
            }
          >
            Add partnership
          </PlusButton>
        </article>

        <article className={spaces.article}>
          <Heading as="h3" className="font-bold">
            Integrations
          </Heading>
          <p>Enable integrations with third party platforms.</p>

          <Heading as="h4" className="font-bold">
            Discord
          </Heading>
          <p>
            Add the official infinity.xyz bot to your Discord server and let it cross-post <code>#announcements</code>{' '}
            to the feed!
          </p>
          <ol className="list-decimal list-inside">
            <li>
              Add the{' '}
              <a className="underline" href={DISCORD_BOT_INVITE_URL} target="_blank">
                official infinity.xyz bot
              </a>{' '}
              to your server.
            </li>
            <li>
              Type the following command to complete the integration. Make sure you are the server owner or have a role
              with the 'Use Application Commands' permission!
              <p>
                <code className="bg-gray-100">/infinity verify {collection?.address || ''} </code>
              </p>
            </li>
            <li>Configure the text channels to monitor for announcements below.</li>
          </ol>
          <TextInputBox
            label="Channels to monitor"
            value={''}
            type="text"
            onChange={console.log}
            placeholder="announcements,952902403055812650"
            isFullWidth
          />

          <Heading as="h4" className="font-bold">
            Twitter
          </Heading>
          <p>Twitter integrations are already enabled by default.</p>
        </article>
      </main>

      <footer className="p-5"></footer>

      <Toaster />
    </div>
  );
}
