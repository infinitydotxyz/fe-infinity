import mitt from 'mitt';
import { apiGet, USER_API_END_POINT } from 'src/utils';
import { UserProfileDto } from '../user/user-profile-dto';

class _UserInfoCache {
  cache = new Map<string, UserProfileDto>();
  fetching = new Set<string>();
  emitter = mitt();

  getUserInfoSync = (userAddress: string): UserProfileDto | undefined => {
    if (this.cache.has(userAddress)) {
      return this.cache.get(userAddress);
    }

    // doesn't exist, get it and force a reload
    this.getUserInfoAsync(userAddress);
  };

  getUserInfo = (userAddress: string): Promise<UserProfileDto | undefined> => {
    const userInfo = this.getUserInfoSync(userAddress);

    if (userInfo) {
      return Promise.resolve(this.cache.get(userAddress));
    }

    return this.getUserInfoAsync(userAddress);
  };

  getUserInfoAsync = async (userAddress: string): Promise<UserProfileDto | undefined> => {
    // don't fetch same userAddress while waiting for result
    if (this.fetching.has(userAddress)) {
      return;
    }
    this.fetching.add(userAddress);

    const { result, error } = await apiGet(`${USER_API_END_POINT}/${userAddress}`);

    if (error) {
      console.log(userAddress);
      console.log(error);
    } else {
      const userInfo = result as UserProfileDto;
      userInfo.address = userInfo.address || userAddress; // necessary?

      this.cache.set(userAddress, userInfo);
      this.emitter.emit('updated');

      // only removes on success, so this should stop any failures
      this.fetching.delete(userAddress);

      return userInfo;
    }
  };
}

const UserInfoCache = new _UserInfoCache();
export { UserInfoCache };
