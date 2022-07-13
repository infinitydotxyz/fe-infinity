import { apiGet, USER_API_END_POINT } from 'src/utils';
import { UserProfileDto } from '../user/user-profile-dto';

const _cache = new Map<string, UserProfileDto>();

export const getUserInfoSync = (userAddress: string): UserProfileDto | undefined => {
  if (_cache.has(userAddress)) {
    return _cache.get(userAddress);
  }

  // doesn't exist, get it and force a reload
  getUserInfoAsync(userAddress);
};

export const getUserInfo = async (userAddress: string): Promise<UserProfileDto | undefined> => {
  const userInfo = getUserInfoSync(userAddress);

  if (userInfo) {
    return _cache.get(userAddress);
  }

  return getUserInfoAsync(userAddress);
};

export const getUserInfoAsync = async (userAddress: string): Promise<UserProfileDto | undefined> => {
  const { result, error } = await apiGet(`${USER_API_END_POINT}/${userAddress}`);

  if (error) {
    console.log(userAddress);
    console.log(error);
  } else {
    const userInfo = result as UserProfileDto;
    userInfo.address = userInfo.address || userAddress; // necessary?

    _cache.set(userAddress, userInfo);

    return userInfo;
  }
};
