import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from 'src/utils/context/AppContext';
import { WalletType } from 'src/utils/providers/AbstractProvider';
import { SVG, NextLink } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { iconButtonStyle } from 'src/utils/ui-constants';

const ConnectWallet = () => {
  const router = useRouter();
  const { connectWallet, user, userReady } = useAppContext();

  useEffect(() => {
    if (user?.address && userReady) {
      router.back();
    }
  }, [userReady, user]);

  // const connectCoinbase = async () => {
  //   await connectWallet?.(WalletType.WalletLink);
  // };

  const connectMetaMask = async () => {
    await connectWallet?.(WalletType.MetaMask);
  };

  // const connectWalletConnect = async () => {
  //   await connectWallet?.(WalletType.WalletConnect);
  // };

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden grid place-content-center">
      <div className="flex flex-col gap-2 items-center">
        <NextLink href="/" className="w-1/2">
          <SVG.logo />
        </NextLink>

        <div className="drop-shadow-2xl bg-white rounded-3xl flex flex-col items-center mx-0 my-4 p-8">
          <SVG.connectImage className="h-16 w-16" />
          <h1 className="tg-desc text-center mb-3">Connect Wallet</h1>

          <ConnectItem
            onClick={connectMetaMask}
            icon={<SVG.metamask className="h-16" />}
            title="Metamask"
            subtitle="Connect using browser wallet"
          />

          {/* <ConnectItem
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
          /> */}
        </div>
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
  return (
    <div
      className="rounded-lg border-solid border cursor-pointer flex items-center mb-2 p-5 w-full hover:bg-gray-100"
      onClick={onClick}
    >
      {icon}
      <div className="flex-column text-left align-self-center px-10">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-gray">{subtitle}</p>
      </div>
      <SVG.arrowImage className={twMerge(iconButtonStyle, 'ml-auto')} />
    </div>
  );
};
