import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from 'src/utils/context/AppContext';
import { WalletType } from 'src/utils/providers/AbstractProvider';
import { SVG, NextLink } from 'src/components/common';

const ConnectWallet = () => {
  const router = useRouter();
  const { connectWallet, user, userReady } = useAppContext();

  useEffect(() => {
    if (user?.address && userReady) {
      router.back();
    }
  }, [userReady, user]);

  const connectCoinbase = async () => {
    await connectWallet?.(WalletType.WalletLink);
  };

  const connectMetaMask = async () => {
    await connectWallet?.(WalletType.MetaMask);
  };

  const connectWalletConnect = async () => {
    await connectWallet?.(WalletType.WalletConnect);
  };

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden grid gap-2 place-content-center">
      <NextLink href="/" className="w-1/2 place-self-center">
        <SVG.logo />
      </NextLink>

      <div className="drop-shadow-2xl bg-white rounded-xl flex flex-col items-center mx-0 my-4 p-8">
        <SVG.connectImage className="h-16 w-16" />
        <h1 className="tg-desc text-center mb-3">Connect Wallet</h1>

        <ConnectItem
          onClick={connectMetaMask}
          icon={<SVG.metamask className="h-16" />}
          title="Metamask"
          subtitle="Connect using browser wallet"
        />

        <ConnectItem
          onClick={connectWalletConnect}
          icon={<SVG.walletconnect className="h-16" />}
          title="WalletConnect"
          subtitle="Connect using mobile wallet"
        />
        <ConnectItem
          onClick={connectCoinbase}
          icon={<SVG.coinbasewallet className="h-16" />}
          title="Coinbase"
          subtitle="Connect using Coinbase wallet"
        />
      </div>
    </div>
  );
};

export default ConnectWallet;

// ===============================================

interface Props {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  onClick: () => void;
}

const ConnectItem = ({ title, icon, subtitle, onClick }: Props): JSX.Element => {
  const arrowImage = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-auto">
      <path
        d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008"
        stroke="#292D32"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  return (
    <div className="rounded-lg border-solid border cursor-pointer flex items-center mb-2 p-5 w-full" onClick={onClick}>
      {icon}
      <div className="flex-column text-left align-self-center px-10">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-gray">{subtitle}</p>
      </div>
      {arrowImage}
    </div>
  );
};
