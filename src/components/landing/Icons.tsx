import React from 'react';
import { ExternalLink, SVG } from '../common';

const size = 'h-6';

export const DiscordIconLink: React.FC = () => (
  <ExternalLink href="https://discord.gg/unwAnymWDN" rel="noreferrer">
    <SVG.discord className={size} />
  </ExternalLink>
);

export const TwitterIconLink: React.FC = () => (
  <ExternalLink href="https://twitter.com/infinitydotxyz" rel="noreferrer">
    <SVG.twitter className={size} />
  </ExternalLink>
);

export const MediumIconLink: React.FC = () => (
  <ExternalLink href="https://medium.com/@infinitydotxyz" rel="noreferrer">
    <SVG.medium className={size} />
  </ExternalLink>
);

export const InstagramIconLink: React.FC = () => (
  <ExternalLink href="https://www.instagram.com/infinitydotxyz/" rel="noreferrer">
    <SVG.instagram className={size} />
  </ExternalLink>
);
