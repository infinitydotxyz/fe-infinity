import { WalletType } from './AbstractProvider';

export class UserRejectException extends Error {
  type = 'USER_REJECT';

  wallet: WalletType;

  constructor(walletType: WalletType) {
    super();
    this.wallet = walletType;
  }

  get message() {
    return `${this.wallet}: User rejected request`;
  }
}
