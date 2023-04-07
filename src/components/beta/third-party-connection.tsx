import Link from 'next/link';
import { AButton } from '../astra/astra-button';

export interface LinkStep {
  title: string;
  message: string;
  href: string;
  isComplete: boolean;
}

export interface Props {
  connectionName: string;
  logo: React.ReactNode;
  logoHref: string;
  step: LinkStep;
}

export const ThirdPartyConnection = (props: Props) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center mx-4 my-2">
      <div className=" h-max border-1 m-auto px-4 py-2 flex flex-col justify-center items-center">
        <div className="flex flex-row text-xl font-heading justify-center items-center">
          <h4 className={'m-4'}>{props.step.title}</h4>
          <Link href={props.logoHref} target="__blank">
            {props.logo}
          </Link>
        </div>
        <div className={props.step.isComplete ? 'hidden' : 'flex flex-col'}>
          <Link href={props.step.href} target="__blank">
            <AButton primary>{props.step.message}</AButton>
          </Link>
        </div>

        <div className={props.step.isComplete ? 'flex' : 'hidden'}>
          <AButton primary disabled>
            Complete
          </AButton>
        </div>
      </div>
    </div>
  );
};
