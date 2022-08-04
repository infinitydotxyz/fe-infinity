import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import trezorModule from '@web3-onboard/trezor';
import ledgerModule from '@web3-onboard/ledger';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseModule from '@web3-onboard/coinbase';
import torusModule from '@web3-onboard/torus';
import keepkeyModule from '@web3-onboard/keepkey';
import gnosisModule from '@web3-onboard/gnosis';
import blocknativeLogo from 'src/images/blocknative-logo';
import blocknativeIcon from 'src/images/blocknative-icon';

const alchemyJsonRpcEthMainnet = 'https://eth-mainnet.alchemyapi.io/v2/3mIyUchls4JVljIH_3YbC7es9U3BI3_s';
const alchemyJsonRpcPolygonMainnet = 'https://polygon-mainnet.g.alchemy.com/v2/LxNovF6VKKnd82eTr-sExIgwj-p-lIcm';
const alchemyJsonRpcEthGoerli = 'https://eth-goerli.alchemyapi.io/v2/60__39or1njWwm-Bu4sdO4X6H2PMuLOt';

const injected = injectedModule();
const coinbase = coinbaseModule();
const walletConnect = walletConnectModule();
const torus = torusModule();
const ledger = ledgerModule();
const keepkey = keepkeyModule();
const gnosis = gnosisModule();

const trezorOptions = {
  email: 'test@test.com',
  appUrl: 'https://infinity.xyz'
};

const trezor = trezorModule(trezorOptions);

export const setupOnboard = () => {
  init({
    wallets: [injected, ledger, coinbase, trezor, walletConnect, gnosis, keepkey, torus],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum',
        rpcUrl: alchemyJsonRpcEthMainnet
      },
      {
        id: '0x4',
        token: 'rETH',
        label: 'Rinkeby',
        rpcUrl: 'https://rinkeby-light.eth.linkpool.io'
      },
      {
        id: '0x38',
        token: 'BNB',
        label: 'Binance',
        rpcUrl: 'https://bsc-dataseed.binance.org/'
      },
      {
        id: '0x89',
        token: 'MATIC',
        label: 'Polygon',
        rpcUrl: alchemyJsonRpcPolygonMainnet
      },
      {
        id: '0x5',
        token: 'gETH',
        label: 'Goerli',
        rpcUrl: alchemyJsonRpcEthGoerli
      }
    ],

    appMetadata: {
      name: 'Infinity XYZ',
      icon: blocknativeIcon,
      logo: blocknativeLogo,
      description: 'A place to trade NFTs',
      recommendedInjectedWallets: [
        { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
        { name: 'MetaMask', url: 'https://metamask.io' }
      ],
      agreement: {
        version: '1.0.0',
        termsUrl: 'https://infinity.xyz/terms-conditions',
        privacyUrl: 'https://www.infinity.xyz/privacy-policy'
      }
      // gettingStartedGuide: 'https://infinity.xyz',
      // explore: 'https://infinity.xyz'
    },
    accountCenter: {
      desktop: {
        position: 'bottomRight',
        enabled: true,
        minimal: false
      },
      mobile: {
        position: 'bottomRight',
        enabled: true,
        minimal: false
      }
    }
  });
};
