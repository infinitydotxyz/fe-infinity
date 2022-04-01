import React from 'react';
import Link from 'next/link';
import { useAppContext } from 'src/utils/context/AppContext';

import styles from './Header.module.scss';
import { Button, Spacer } from '../common';
import logo from 'src/images/logo-new.svg';
import miniLogo from 'src/images/logo-mini-new.svg';

const Header = (): JSX.Element => {
  const { user, signOut } = useAppContext();

  const signedIn = !!user?.address;

  let accountButton;

  if (signedIn) {
    accountButton = (
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </Button>
    );
  } else {
    accountButton = (
      <Link href="/connect" passHref>
        <div className={styles.connectButton}>
          <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.19.367a14.05 14.05 0 00-6.38 0l-.44.102C3.435 1.153 1.121 3.524.397 6.59c-.53 2.24-.53 4.58 0 6.82.724 3.066 3.038 5.437 5.973 6.12l.44.103c2.101.49 4.279.49 6.38 0l.44-.102c2.935-.684 5.249-3.055 5.973-6.121.53-2.24.53-4.58 0-6.82-.724-3.066-3.038-5.437-5.973-6.12l-.44-.103zm3.066 7.197a5.322 5.322 0 011.197-.077c.438.022.783.382.842.84.143 1.11.143 2.236 0 3.347-.059.457-.404.817-.842.838-.398.02-.8-.005-1.197-.076l-.078-.014c-1.033-.185-1.832-.921-2.102-1.849a2.047 2.047 0 010-1.146c.27-.928 1.069-1.664 2.102-1.849l.078-.014zM5.101 6.641c0-.37.286-.671.639-.671H10c.353 0 .64.3.64.671 0 .371-.287.672-.64.672H5.74c-.353 0-.64-.3-.64-.672z"
              fill="#333"
            />
          </svg>
          <span>Connect</span>
        </div>
      </Link>
    );
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.pageHeader} max-w-screen-lg`}>
        <div className={styles.showLargeLogo}>
          <Link href="/" passHref>
            <img className="can-click" alt="logo" src={logo.src} width={logo.width} />
          </Link>
        </div>
        <div className={styles.showSmallLogo}>
          <Link href="/" passHref>
            <img
              style={{ flex: '0 1 auto' }}
              className="can-click"
              alt="logo"
              src={miniLogo.src}
              width={miniLogo.width}
            />
          </Link>
        </div>

        <Spacer />

        <div className={styles.links}>{accountButton}</div>
      </div>
    </header>
  );
};

export default Header;
