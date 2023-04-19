import { CompletedDiscord, ConnectDiscord, Discord, JoinDiscord, VerifyDiscord } from 'src/hooks/useSignUpState';
import { ButtonStep, LinkStep, ThirdPartyConnection } from './third-party-connection';
import { FaDiscord } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface Props {
  state: ConnectDiscord | JoinDiscord | VerifyDiscord | CompletedDiscord;
}

const discordLogoHref = 'https://discord.gg/flowdotso';
const discordLogo = FaDiscord({ className: 'text-brand-discord' });

const getStep = (state: Props['state']): { step: LinkStep | ButtonStep; disabled: boolean } => {
  switch (state.step) {
    case Discord.Connect: {
      return {
        step: {
          title: 'Connect Discord',
          message: 'Connect',
          href: state.data.url,
          isComplete: false
        },
        disabled: false
      };
    }

    case Discord.Join: {
      return {
        step: {
          title: 'Join us on Discord',
          message: 'Join',
          href: state.data.url,
          isComplete: false
        },
        disabled: false
      };
    }

    case Discord.Verify: {
      return {
        step: {
          title: 'Complete Discord verification',
          message: 'Incomplete',
          onClick: () => {
            // no-op
          },
          isComplete: false
        },
        disabled: true
      };
    }

    case Discord.Complete: {
      return {
        step: {
          title: 'Discord Verification Complete',
          message: 'Complete',
          href: '',
          isComplete: true
        },
        disabled: false
      };
    }
  }
};

export const DiscordConnect = (props: Props) => {
  const [step, setStep] = useState(getStep(props.state));

  useEffect(() => {
    setStep(getStep(props.state));
  }, [props.state]);

  return (
    <ThirdPartyConnection
      connectionName="Discord"
      logoHref={discordLogoHref}
      logo={discordLogo}
      step={step.step}
      disabled={step.disabled}
    />
  );
};
