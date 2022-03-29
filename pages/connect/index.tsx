import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppContext } from 'src/utils/context/AppContext';
import { WalletType } from 'src/utils/providers/AbstractProvider';
import { PageBox } from 'src/components/common';
import logo from 'src/images/logo-new.svg';
import metamask from 'src/images/metamask.svg';
import coinbase from 'src/images/coinbase.svg';
import walletConnect from 'src/images/walletConnect.svg';

export default function ConnectWallet() {
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

  const dark = 'dark';

  const connectImage = (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none">
      <path
        opacity="0.8"
        d="M12.8992 2.52009L12.8692 2.59009L9.96922 9.32009H7.11922C6.43922 9.32009 5.79922 9.45009 5.19922 9.71009L6.94922 5.53009L6.98922 5.44009L7.04922 5.28009C7.07922 5.21009 7.09922 5.15009 7.12922 5.10009C8.43922 2.07009 9.91922 1.38009 12.8992 2.52009Z"
        fill="#000"
      ></path>
      <path
        d="M18.2907 9.52002C17.8407 9.39002 17.3707 9.32002 16.8807 9.32002H9.9707L12.8707 2.59002L12.9007 2.52002C13.0407 2.57002 13.1907 2.64002 13.3407 2.69002L15.5507 3.62002C16.7807 4.13002 17.6407 4.66002 18.1707 5.30002C18.2607 5.42002 18.3407 5.53002 18.4207 5.66002C18.5107 5.80002 18.5807 5.94002 18.6207 6.09002C18.6607 6.18002 18.6907 6.26002 18.7107 6.35002C18.9707 7.20002 18.8107 8.23002 18.2907 9.52002Z"
        fill="#000"
      ></path>
      <path
        opacity="0.4"
        d="M21.7602 14.1998V16.1498C21.7602 16.3498 21.7502 16.5498 21.7402 16.7398C21.5502 20.2398 19.6002 21.9998 15.9002 21.9998H8.10023C7.85023 21.9998 7.62023 21.9798 7.39023 21.9498C4.21023 21.7398 2.51023 20.0398 2.29023 16.8598C2.26023 16.6198 2.24023 16.3898 2.24023 16.1498V14.1998C2.24023 12.1898 3.46023 10.4598 5.20023 9.70982C5.80023 9.44982 6.44023 9.31982 7.12023 9.31982H16.8802C17.3702 9.31982 17.8402 9.38982 18.2902 9.51982C20.2902 10.1298 21.7602 11.9898 21.7602 14.1998Z"
        fill="#000"
      ></path>
      <path
        opacity="0.6"
        d="M6.95023 5.52979L5.20023 9.70978C3.46023 10.4598 2.24023 12.1898 2.24023 14.1998V11.2698C2.24023 8.42979 4.26023 6.05979 6.95023 5.52979Z"
        fill="#000"
      ></path>
      <path
        opacity="0.6"
        d="M21.7591 11.2698V14.1998C21.7591 11.9898 20.2891 10.1298 18.2891 9.51984C18.8091 8.22984 18.9691 7.19984 18.7091 6.34984C18.6891 6.25984 18.6591 6.17984 18.6191 6.08984C20.4891 7.05984 21.7591 9.02984 21.7591 11.2698Z"
        fill="#000"
      ></path>
    </svg>
  );

  return (
    <PageBox title="Connect Wallet" showConnect={false}>
      <div>
        <Link href="/">
          <a>
            <img alt="Infinity" src={dark ? logo.src : logo.src} width={logo.width} />
          </a>
        </Link>

        <div className="drop-shadow-2xl bg-white rounded-xl flex flex-col items-center mx-0 my-4 p-8">
          {connectImage}
          <h1 className="tg-desc text-center mb-3">Connect Wallet</h1>

          <ConnectItem
            onClick={connectMetaMask}
            img={metamask.src}
            title="Metamask"
            subtitle="Connect using browser wallet"
          />

          <ConnectItem
            onClick={connectWalletConnect}
            img={walletConnect.src}
            title="WalletConnect"
            subtitle="Connect using mobile wallet"
          />

          <ConnectItem
            onClick={connectCoinbase}
            img={coinbase.src}
            title="Coinbase"
            subtitle="Connect using Coinbase wallet"
          />
        </div>
      </div>
    </PageBox>
  );
}

// ===============================================

interface Props {
  title: string;
  subtitle: string;
  img: string;
  onClick: () => void;
}

function ConnectItem({ title, img, subtitle, onClick }: Props): JSX.Element {
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
      <div className="logo-metamask d-flex align-self-center">
        <Image alt="Infinity" src={img} width={56} height={56} className="align-self-center" />
      </div>
      <div className="d-flex flex-column text-left align-self-center pl-20">
        <p className="tg-desc">{title}</p>
        <p className="text-gray">{subtitle}</p>
      </div>
      {arrowImage}
    </div>
  );
}
