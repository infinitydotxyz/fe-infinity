import type { FC } from 'react';
import { CommonHead } from 'src/components/common';

export const NotFound: FC = () => {
  return (
    <CommonHead title="Error: Not Found">
      <h6>Not Found</h6>
    </CommonHead>
  );
};

export default NotFound;
