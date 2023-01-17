import React from 'react';
import { ExternalLink } from '../common';
import { BsMedium, BsTwitter, BsInstagram } from 'react-icons/bs';
import { SiDiscord } from 'react-icons/si';

const size = 'h-7 w-7';

export const DiscordIconLink: React.FC = () => (
  <ExternalLink href="https://discord.com/invite/flowdotso" rel="noreferrer">
    <SiDiscord className={size} />
  </ExternalLink>
);

// todo: fix className once we have smaller size icon.
export const TwitterIconLink: React.FC = () => (
  <ExternalLink href="https://twitter.com/flowdotso" rel="noreferrer">
    <BsTwitter className={size} />
  </ExternalLink>
);

export const MediumIconLink: React.FC = () => (
  <ExternalLink href="https://flowdotso.medium.com" rel="noreferrer">
    <BsMedium className={size} />
  </ExternalLink>
);

// todo: fix className once we have smaller size icon.
export const InstagramIconLink: React.FC = () => (
  <ExternalLink href="https://www.instagram.com/theflowso" rel="noreferrer">
    <BsInstagram className={size} />
  </ExternalLink>
);
