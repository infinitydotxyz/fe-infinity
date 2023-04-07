import { CompletedDiscord, ConnectDiscord, Discord, JoinDiscord } from 'src/hooks/useSignUpState';
import { ThirdPartyConnection } from './third-party-connection';
import { FaDiscord } from 'react-icons/fa';

interface Props {
  state: ConnectDiscord | JoinDiscord | CompletedDiscord;
}

export const DiscordConnect = (props: Props) => {
  const discordLogoHref = 'https://discord.gg/flowdotso';
  const discordLogo = FaDiscord({});
  switch (props.state.step) {
    case Discord.Connect: {
      const step = {
        title: 'Connect Discord',
        message: 'Connect',
        href: props.state.data.url,
        isComplete: false
      };

      return (
        <ThirdPartyConnection connectionName="Discord" logoHref={discordLogoHref} logo={discordLogo} step={step} />
      );
    }
    case Discord.Join: {
      const step = {
        title: 'Join us on Discord',
        message: 'Join',
        href: props.state.data.url,
        isComplete: false
      };

      return (
        <ThirdPartyConnection connectionName="Discord" logoHref={discordLogoHref} logo={discordLogo} step={step} />
      );
    }
    case Discord.Complete: {
      const step = {
        title: 'Join us on Discord',
        message: 'Join',
        href: '',
        isComplete: true
      };

      return (
        <ThirdPartyConnection connectionName="Discord" logoHref={discordLogoHref} logo={discordLogo} step={step} />
      );
    }
  }
};
