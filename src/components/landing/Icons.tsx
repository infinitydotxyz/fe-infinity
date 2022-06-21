import React from 'react';
import { ExternalLink, SVG } from '../common';

const size = 'h-6';

export const DiscordIconLink: React.FC = () => (
  <ExternalLink href="https://discord.com/invite/infinitydotxyz" rel="noreferrer">
    <SVG.discord className={size} />
  </ExternalLink>
);

// todo: fix className once we have smaller size icon.
export const TwitterIconLink: React.FC = () => (
  <ExternalLink href="https://twitter.com/infinitydotxyz" rel="noreferrer">
    <SVG.twitter className={'h-4'} />
  </ExternalLink>
);

export const MediumIconLink: React.FC = () => (
  <ExternalLink href="https://medium.com/@infinitydotxyz" rel="noreferrer">
    <SVG.medium className={size} />
  </ExternalLink>
);

// todo: fix className once we have smaller size icon.
export const InstagramIconLink: React.FC = () => (
  <ExternalLink href="https://www.instagram.com/infinitydotxyz/" rel="noreferrer">
    <SVG.instagram className={'h-5 mt-0.5'} />
  </ExternalLink>
);
