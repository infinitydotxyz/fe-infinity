import React from 'react';
import { BsTwitter } from 'react-icons/bs';
import { SiDiscord } from 'react-icons/si';
import { ExternalLink } from '../common';

const size = 'h-7 w-7';

export const DiscordIconLink: React.FC = () => (
  <ExternalLink href="https://discord.com/invite/pixelpackio" rel="noreferrer">
    <SiDiscord className={size} />
  </ExternalLink>
);

export const TwitterIconLink: React.FC = () => (
  <ExternalLink href="https://twitter.com/pixelpackio" rel="noreferrer">
    <BsTwitter className={size} />
  </ExternalLink>
);
