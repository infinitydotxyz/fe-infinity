import * as Yup from 'yup';
import { apiGet } from 'src/utils';
import { User } from 'src/utils/context/AppContext';

export const getUserProfileSchema = ({ user }: { user: User }) =>
  Yup.object().shape({
    bio: Yup.string().min(10, 'Too Short!').required('Required'),
    displayName: Yup.string().required('Required'),
    username: Yup.string()
      .min(5, 'Too Short!')
      .max(14, 'Too Long!')
      .matches(/[a-zA-Z0-9_]+$/, 'a-z, A-Z, 0-9, _ can be used')
      .required('Required')
      .test(
        'Unique username',
        'Username already in use', // <- key, message
        (value) => {
          return new Promise((resolve, reject) => {
            apiGet(`/user/${user.address}/checkUsername`, { query: { username: value } })
              .then(({ result, error }) => {
                if (error) {
                  resolve(false);
                }
                if (!result.valid) {
                  resolve(false);
                }
                resolve(true);
              })
              .catch(() => {
                reject(false);
              });
          });
        }
      )
  });
